from applications.database import db
from datetime import datetime

# -----------------------------
# User Model (Worker / Supervisor / HR)
# -----------------------------
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # worker, supervisor, hr

    # Relationships
    skills = db.relationship("WorkerSkill", back_populates="worker")
    tasks = db.relationship("Task", back_populates="assigned_worker")

    def __repr__(self):
        return f"<User {self.name} - {self.role}>"


# -----------------------------
# Skill Model
# -----------------------------
class Skill(db.Model):
    __tablename__ = "skills"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    certification_required = db.Column(db.Boolean, default=False)

    workers = db.relationship("WorkerSkill", back_populates="skill")

    def __repr__(self):
        return f"<Skill {self.name}>"


# -----------------------------
# WorkerSkill (Mapping Table)
# -----------------------------
class WorkerSkill(db.Model):
    __tablename__ = "worker_skills"

    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    skill_id = db.Column(db.Integer, db.ForeignKey("skills.id"))
    proficiency_level = db.Column(db.Integer, default=1)  # 1-5 scale

    worker = db.relationship("User", back_populates="skills")
    skill = db.relationship("Skill", back_populates="workers")

    def __repr__(self):
        return f"<WorkerSkill Worker={self.worker_id}, Skill={self.skill_id}, Level={self.proficiency_level}>"


# -----------------------------
# Task Model
# -----------------------------
class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    required_skill_id = db.Column(db.Integer, db.ForeignKey("skills.id"))
    status = db.Column(db.String(50), default="pending")  # pending, in-progress, completed
    assigned_worker_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    required_skill = db.relationship("Skill")
    assigned_worker = db.relationship("User", back_populates="tasks")
    def __repr__(self):
        return f"<Task {self.name} - {self.status}>"
    def __repr__(self):
        return f"<Task {self.name} - {self.status}>"


# -----------------------------
# Performance Logs (IoT / Machine Data)
# -----------------------------
class PerformanceLog(db.Model):
    __tablename__ = "performance_logs"

    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    task_id = db.Column(db.Integer, db.ForeignKey("tasks.id"))
    cycle_time = db.Column(db.Float, nullable=True)  # seconds
    error_rate = db.Column(db.Float, nullable=True)  # %
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<PerformanceLog Worker={self.worker_id}, Task={self.task_id}, Time={self.cycle_time}, Errors={self.error_rate}>"


# -----------------------------
# Assessments (Micro-Quizzes)
# -----------------------------
class Assessment(db.Model):
    __tablename__ = "assessments"

    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    task_id = db.Column(db.Integer, db.ForeignKey("tasks.id"))
    score = db.Column(db.Float, nullable=False)
    feedback = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Assessment Worker={self.worker_id}, Task={self.task_id}, Score={self.score}>"