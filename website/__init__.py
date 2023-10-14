from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
import os

db = SQLAlchemy()

db_path = os.path.realpath("website/database")


def create_app():

    app = Flask(__name__)
    app.config["SECRET_KEY"] = "qweqdasdsa asdasdsadsa"
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
    # postgresql://shopping_ecfi_user:Wx5NgPSdvvHtXGi0jocgXSwLqj2e7sE6@dpg-ckkstqou1l6c73buajo0-a.oregon-postgres.render.com/shopping_ecfi
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.config['CORS_HEADERS'] = 'Content-Type'
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    from .models import User

    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)

    from .view import view
    from .auth import auth
    from .product import product
    from .addcart import addcart
    from .setting import setting
    from .comment import comment

    app.register_blueprint(view, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")
    app.register_blueprint(product, url_prefix="/")
    app.register_blueprint(addcart, url_prefix="/")
    app.register_blueprint(setting, url_prefix="/")
    app.register_blueprint(comment, url_prefix="/")

    db.init_app(app)
    create_db(app)

    return app


def create_db(app):
    if not os.path.exists(f"sqlite:///{db_path}/shopping.db"):
        with app.app_context():
            db.create_all()
            print("Database created successfully.")
