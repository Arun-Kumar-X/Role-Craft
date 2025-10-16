from flask import Flask
from application.database import db
from application.controllers import init_routes
from application import models

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workforce.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = "supersecretkey"  # needed for sessions/flash

    db.init_app(app)

    with app.app_context():
        db.create_all()

    init_routes(app)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
