from flask import Flask
from applications.database import db
from applications.controllers import init_routes   # this will register your routes

app = Flask(__name__)

# Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workforce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "supersecretkey"   # needed for sessions/login

# Initialize Database
db.init_app(app)

# Create tables once (inside app context)
with app.app_context():
    db.create_all()

# Register routes
init_routes(app)

# Run the App
if __name__ == "__main__":
    app.run(debug=True)