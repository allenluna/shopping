from flask import Blueprint, redirect, render_template, url_for, request, flash, jsonify
from flask_login import current_user
from .models import Setting
from . import db

user_setting = Blueprint("user_setting", __name__)

def userInfo(data):
    return {
        "id" : data.id,
        "name" : data.name,
        "email" : data.email,
        "contact" : data.number,
        "address" : data.address,
        "city" : data.city,
        "zipcode" : data.zipCode
    }
# show the html elements with render template from templates folder
@user_setting.route("/setting")
def user_info():
    userData = Setting.query.filter_by(user_name=current_user).first()
    return render_template("settings.html", data=userData)


# post user data address
@user_setting.route("/add-address", methods=["GET", "POST"])
def add_address():
    if request.method == "POST":
        name = request.json["name"]
        email = request.json["email"]
        address = request.json["address"]
        contact = request.json["contact"]
        city = request.json["city"]
        zipcode = request.json["zipcode"]

        if name == "":
            return jsonify({"message" : "Name should not be empty."})
        elif contact == "":
            return jsonify({"message" : "Contact number should not be empty."})
        elif address == "":
            return jsonify({"message" : "Address should not be empty."})
        elif len(contact) < 11:
            return jsonify({"message" : "Contact number is too short."})
        else:
            userSetting = Setting(
                name = name,
                number = contact,
                email = email,
                city = city,
                address = address,
                zipCode = zipcode,
                user_name = current_user
            )

            db.session.add(userSetting)
            db.session.commit()

            return jsonify(results = {"results" : userInfo(userSetting), "message" : "Success", "users" : len(current_user.setting)})

# update data of users
@user_setting.route("/update-address", methods=["GET", "PATCH"])
def update_address():
    user = Setting.query.filter_by(user_name=current_user).first()

    user.name = request.json["name"]
    user.email = request.json["email"]
    user.number = request.json["contact"]
    user.address = request.json["address"]
    user.city = request.json["city"]
    user.zipCode = request.json["zipcode"]
    db.session.commit()

    return jsonify(results = {"results" : userInfo(user), "message" : "Success", "users" : len(current_user.setting)})


# fetch and read the data from the users
@user_setting.route("/read-setting")
def read_setting():
    usersetting = Setting.query.filter_by(user_name=current_user).first()

    return jsonify(results={"results" : userInfo(usersetting), "message": "Success", "users" : len(current_user.setting)})

# delete data address
@user_setting.route("/delete-address")
def delete_address():
    deleteSetting = Setting.query.filter_by(user_name=current_user).first()
    db.session.delete(deleteSetting)
    db.session.commit()

    return {"message":"Deleted"}

@user_setting.route("/mastercard/<int:id>")
def mastercard(id):
    return render_template("mastercard.html", id=id, current_user=current_user)