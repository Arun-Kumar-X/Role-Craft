from application.database import db
from datetime import datetime

# User Table
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    emp_id = db.Column(db.String(50), unique=True, nullable=False)  
    name = db.Column(db.String(100), nullable=False)                 
    email = db.Column(db.String(120), unique=True, nullable=False)   
    password = db.Column(db.String(200), nullable=False)             
    role = db.Column(db.String(50), nullable=False)

    # Relationships
    tasks = db.relationship("Task", back_populates="assigned_worker", foreign_keys="Task.assigned_worker_id")
    assessments = db.relationship("Assessment", back_populates="worker", cascade="all, delete-orphan")
    machine_logs = db.relationship("MachineLog", back_populates="worker", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.emp_id} - {self.name} ({self.role})>"


# Task Table
class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default="pending")

    assigned_worker_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_by_supervisor_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    # Relationships
    assigned_worker = db.relationship("User", back_populates="tasks", foreign_keys=[assigned_worker_id])

    def __repr__(self):
        return f"<Task {self.name} status={self.status}>"


# Assessment Table
class Assessment(db.Model):
    __tablename__ = "assessments"

    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    task_id = db.Column(db.Integer, db.ForeignKey("tasks.id"))
    score = db.Column(db.Float, nullable=False)
    feedback = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    worker = db.relationship("User", back_populates="assessments")
    task = db.relationship("Task")

    def __repr__(self):
        return f"<Assessment worker={self.worker_id} task={self.task_id} score={self.score}>"


# MachineLog Table
class MachineLog(db.Model):
    __tablename__ = "machine_logs"

    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    task_id = db.Column(db.Integer, db.ForeignKey("tasks.id"), nullable=True)
    machine_name = db.Column(db.String(100), nullable=True)         
    input_params = db.Column(db.Text, nullable=True)            
    output_quality = db.Column(db.String(100), nullable=True)  
    timestamp_start = db.Column(db.DateTime, default=datetime.utcnow)
    timestamp_end = db.Column(db.DateTime, nullable=True)

    # Relationships
    worker = db.relationship("User", back_populates="machine_logs")
    task = db.relationship("Task")

    def __repr__(self):
        return f"<MachineLog worker={self.worker_id} machine={self.machine_name} start={self.timestamp_start}>"