from flask import render_template, request, redirect, url_for, session, flash
from applications.database import db
from applications.models import User
from werkzeug.security import check_password_hash

# -----------------------------
# Initialize Routes
# -----------------------------
def init_routes(app):

    # -----------------------------
    # Login Route
    # -----------------------------
    @app.route("/", methods=["GET", "POST"])
    @app.route("/login", methods=["GET", "POST"])
    def login():
        if request.method == "POST":
            email = request.form.get("email")
            password = request.form.get("password")

            # Find user by email
            user = User.query.filter_by(email=email).first()

            if user and check_password_hash(user.password, password):
                # Store user info in session
                session["user_id"] = user.id
                session["role"] = user.role

                flash("Login successful!", "success")

                # Redirect based on role
                if user.role == "worker":
                    return redirect(url_for("worker_dashboard"))
                elif user.role == "supervisor":
                    return redirect(url_for("supervisor_dashboard"))
                elif user.role == "hr":
                    return redirect(url_for("hr_dashboard"))
                else:
                    flash("Unknown role!", "danger")
                    return redirect(url_for("login"))
            else:
                flash("Invalid credentials", "danger")
                return redirect(url_for("login"))

        return render_template("login.html")

    # -----------------------------
    # Worker Dashboard
    # -----------------------------
    @app.route("/worker/dashboard")
    def worker_dashboard():
        if session.get("role") != "worker":
            flash("Unauthorized access", "danger")
            return redirect(url_for("login"))
        return render_template("worker_dashboard.html")

    # -----------------------------
    # Supervisor Dashboard
    # -----------------------------
    @app.route("/supervisor/dashboard")
    def supervisor_dashboard():
        if session.get("role") != "supervisor":
            flash("Unauthorized access", "danger")
            return redirect(url_for("login"))
        return render_template("supervisor_dashboard.html")

    # -----------------------------
    # HR Dashboard
    # -----------------------------
    @app.route("/hr/dashboard")
    def hr_dashboard():
        if session.get("role") != "hr":
            flash("Unauthorized access", "danger")
            return redirect(url_for("login"))
        return render_template("reports.html")
