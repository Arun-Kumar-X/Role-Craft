from flask import render_template, request, redirect, url_for, session, flash
from application.database import db
from application.models import User, Task, MachineLog, WorkSession
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime

def init_routes(app):

    # -----------------------------
    # Login (GET: form, POST: authenticate)
    # -----------------------------
    @app.route("/", methods=["GET", "POST"])
    @app.route("/login", methods=["GET", "POST"])
    def login():
        if request.method == "POST":
            emp_id = request.form.get("emp_id", "").strip()
            password = request.form.get("password", "")
            role = request.form.get("role", "").strip().lower()

            if not emp_id or not password or not role:
                flash("All fields are required.", "warning")
                return redirect(url_for("login"))

            user = User.query.filter_by(emp_id=emp_id, role=role).first()

            if not user:
                flash("User not found for given Employee ID and Role.", "danger")
                return redirect(url_for("login"))

            if not check_password_hash(user.password, password):
                flash("Invalid password.", "danger")
                return redirect(url_for("login"))

            # Auth success
            session.clear()
            session["user_id"] = user.id
            session["emp_id"] = user.emp_id
            session["role"] = user.role

            flash("Login successful.", "success")

            if user.role == "worker":
                return redirect(url_for("worker_dashboard"))
            elif user.role == "supervisor":
                return redirect(url_for("supervisor_dashboard"))
            elif user.role == "hr":
                return redirect(url_for("hr_dashboard"))
            else:
                flash("Unknown role.", "danger")
                return redirect(url_for("login"))

        return render_template("login.html")

    # -----------------------------
    # Role guard helper
    # -----------------------------
    def require_role(expected):
        return session.get("role") == expected

    # -----------------------------
    # Worker: Dashboard
    # -----------------------------
    @app.route("/worker/dashboard")
    def worker_dashboard():
        if session.get("role") != "worker":
            flash("Unauthorized access.", "danger")
            return redirect(url_for("login"))

        worker_id = session.get("user_id")
        worker = User.query.get_or_404(worker_id)

        # Fetch tasks assigned to this worker
        tasks = Task.query.filter_by(assigned_worker_id=worker_id).all()

        # Example: notifications could be pulled from a Notification table,
        # or just a placeholder list for now
        notifications = []  

        # Fetch recent machine logs for this worker
        machine_logs = MachineLog.query.filter_by(worker_id=worker_id).order_by(
            MachineLog.timestamp_start.desc()
        ).limit(5).all()

        return render_template(
            "worker_dashboard.html",
            worker=worker,
            tasks=tasks,
            notifications=notifications,
            machine_logs=machine_logs
        )
    # -----------------------------
    # Worker: Task Details
    # -----------------------------
    @app.route("/worker/task/<int:task_id>")
    def task_details(task_id):
        if session.get("role") != "worker":
            flash("Unauthorized access.", "danger")
            return redirect(url_for("login"))

        task = Task.query.get_or_404(task_id)
        supervisor = User.query.get(task.created_by_supervisor_id) if task.created_by_supervisor_id else None
        worker = User.query.get(session.get("user_id"))

        # Fetch all sessions for this task/worker
        work_sessions = WorkSession.query.filter_by(task_id=task.id, worker_id=worker.id).all()

        return render_template(
            "task_details.html",
            task=task,
            supervisor=supervisor,
            worker=worker,
            work_sessions=work_sessions
        )
    # -----------------------------
    # Worker: Update Task Status
    # -----------------------------
    @app.route("/worker/task/<int:task_id>/update", methods=["POST"])
    def update_task_status(task_id):
        if session.get("role") != "worker":
            flash("Unauthorized access.", "danger")
            return redirect(url_for("login"))

        task = Task.query.get_or_404(task_id)

        if task.assigned_worker_id != session.get("user_id"):
            flash("This task is not assigned to you.", "danger")
            return redirect(url_for("worker_dashboard"))

        new_status = request.form.get("status")
        if new_status in ["pending", "in-progress", "completed"]:
            task.status = new_status
            db.session.commit()
            flash("Task status updated.", "success")
        else:
            flash("Invalid status.", "danger")

        return redirect(url_for("task_details", task_id=task_id))
    
    @app.route("/worker/task/<int:task_id>/start_session", methods=["POST"])
    def start_session(task_id):
        if session.get("role") != "worker":
            flash("Unauthorized access.", "danger")
            return redirect(url_for("login"))

        worker_id = session.get("user_id")
        new_session = WorkSession(task_id=task_id, worker_id=worker_id, start_time=datetime.utcnow())
        db.session.add(new_session)
        db.session.commit()
        flash("Work session started.", "success")
        return redirect(url_for("task_details", task_id=task_id))


    @app.route("/worker/task/<int:task_id>/end_session", methods=["POST"])
    def end_session(task_id):
        if session.get("role") != "worker":
            flash("Unauthorized access.", "danger")
            return redirect(url_for("login"))

        worker_id = session.get("user_id")
        session_entry = WorkSession.query.filter_by(task_id=task_id, worker_id=worker_id, end_time=None).first()
        if session_entry:
            session_entry.end_time = datetime.utcnow()
            db.session.commit()
            flash("Work session ended.", "success")
        else:
            flash("No active session to end.", "warning")

        return redirect(url_for("task_details", task_id=task_id))

    # -----------------------------
    # Supervisor dashboard
    # -----------------------------
    @app.route("/supervisor/dashboard")
    def supervisor_dashboard():
        if not require_role("supervisor"):
            flash("Unauthorized access.", "danger")
            return redirect(url_for("login"))
        return render_template("supervisor_dashboard.html")

    # -----------------------------
    # HR dashboard
    # -----------------------------
    @app.route("/hr/dashboard")
    def hr_dashboard():
        if not require_role("hr"):
            flash("Unauthorized access.", "danger")
            return redirect(url_for("login"))
        return render_template("hr_dashboard.html")

    # -----------------------------
    # HR: Add Employee
    # -----------------------------
    @app.route("/hr/add_employee", methods=["GET", "POST"])
    def add_employee():
        # if not require_role("hr"):
        #     flash("Unauthorized access.", "danger")
        #     return redirect(url_for("login"))

        if request.method == "POST":
            fullname = request.form.get("fullname")
            emp_id = request.form.get("employee_id")
            email = request.form.get("email")
            password = request.form.get("password")
            confirm_password = request.form.get("confirm_password")
            role = request.form.get("role")

            if password != confirm_password:
                flash("Passwords do not match.", "danger")
                return redirect(url_for("add_employee"))

            existing = User.query.filter(
                (User.emp_id == emp_id) | (User.email == email)
            ).first()
            if existing:
                flash("Employee ID or Email already exists.", "danger")
                return redirect(url_for("add_employee"))

            hashed_pw = generate_password_hash(password)
            new_user = User(emp_id=emp_id,
                            name=fullname,
                            email=email,
                            password=hashed_pw,
                            role=role)
            db.session.add(new_user)
            db.session.commit()

            flash("Employee added successfully!", "success")
            return redirect(url_for("hr_dashboard"))

        return render_template("add_employee.html")

    # -----------------------------
    # Logout
    # -----------------------------
    @app.route("/logout")
    def logout():
        session.clear()
        flash("Logged out.", "info")
        return redirect(url_for("login"))
