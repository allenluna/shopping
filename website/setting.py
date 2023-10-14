from flask import Blueprint, render_template, redirect, url_for, flash, request, jsonify, make_response
from flask_login import current_user
from functools import wraps
from flask_cors import cross_origin
import json
from .models import Setting
from . import db

setting = Blueprint("setting", __name__)


def need_to_authenticate(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return redirect(url_for("auth.login"))
        return f(*args, **kwargs)
    return decorated_function

def only_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.id == 1:
            return redirect(url_for("view.home"))
        return f(*args, **kwargs)
    return decorated_function


def userInfo(data):
    return {
        "name": data.name,
        "email": data.email,
        "address": data.address,
        "contact": data.number,
        "city": data.city,
        "zipcode": data.zipcode
    }


@setting.route("/user_address", methods=["GET", "POST"])
@need_to_authenticate
def user_address():
    return render_template("user_address.html")


@setting.route("/users-data")
@cross_origin()
def user_info():
    user_data = Setting.query.filter_by(user_name=current_user).first()

    if user_data != "None":
        return jsonify({"results": userInfo(user_data), "users": len(current_user.settings), "message": "No Data"})

    return json.dumps({"results": "Please insert data"})


@setting.route("/update-address", methods=["GET", "PATCH"])
def update_address():

    if request.method == "PATCH":
        user_data = Setting.query.filter_by(user_name=current_user).first()
        user_data.name = request.form["name"]
        user_data.email = request.form["email"]
        user_data.number = request.form["contact"]
        user_data.address = request.form["address"]
        user_data.city = request.form["city"]
        user_data.zipcode = request.form["zipcode"]

        db.session.commit()
        return {"results": userInfo(user_data)}


@setting.route("/users-address", methods=["GET", "POST"])
@cross_origin()
def add_address():
    if request.method == "POST":
        name = request.form["name"]
        contact = request.form["contact"]
        email = request.form["email"]
        address = request.form["address"]
        city = request.form["city"]
        zipcode = request.form["zipcode"]
        if contact == "":
            return {"message": "Contact number is required."}
        elif len(contact) < 11:
            return {"message": "Contact is too short."}
        elif len(zipcode) < 4:
            return {"message": "Success"}
        else:
            user_address = Setting(
                name=name,
                number=contact,
                email=email,
                address=address,
                city=city,
                zipcode=zipcode,
                user_name=current_user
            )
            db.session.add(user_address)
            db.session.commit()
            return {"results": userInfo(user_address), "message": "Success", "users": len(current_user.settings)}


@setting.route("/delete-address")
@need_to_authenticate
def delete_address():
    delete_address = Setting.query.filter_by(
        user_name=current_user).first()
    db.session.delete(delete_address)
    db.session.commit()
    return {"message": "Deleted"}
