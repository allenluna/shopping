from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, login_user, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

from .models import User
from . import db

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":
        
        name = request.form.get("name")
        email = request.form.get("email")
        password = generate_password_hash(request.form.get("password"), method="sha256", salt_length=8)
        user = User.query.filter_by(email=email).first()

        if user:
            flash("Email already registered.")
        elif len(email) < 8:
            flash("Email is too short.")
        elif len(password) < 8:
            flash("Password is too short.")
        else:
            new_user = User(name=name, email=email, password=password)
            db.session.add(new_user)
            db.session.commit()

            user = User.query.filter_by(email=email).first()
            login_user(new_user)
            if user.id == 1:
                return redirect(url_for("view.dashboard"))
            return redirect(url_for("view.home"))

    return render_template("register.html", current_user=current_user)

@auth.route("/login", methods=["GET", "POST"])
def login():

    email = request.form.get("email")
    password = request.form.get("password")
    user = User.query.filter_by(email=email).first()

    if request.method == "POST":
        if not user:
            flash("Email does not exists, please sign up.")
        elif not check_password_hash(user.password, password):
            flash("Incorrect password, try again.")
        else:
            
            login_user(user)
            if user.id == 1:
                return redirect(url_for("view.dashboard"))
            else:
                return redirect(url_for("view.home"))

    return render_template("login.html", current_user=current_user)

@auth.route("/logout")
@login_required
def logout():
    logout_user()

    return redirect(url_for("auth.login"))



