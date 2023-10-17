from flask_login import UserMixin
from sqlalchemy.orm import Relationship
from sqlalchemy import JSON
from . import db
from datetime import datetime


class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))

    posts = Relationship("Product", back_populates="user_name")
    addcart = Relationship("Addcart", back_populates="user_name")
    settings = Relationship("Setting", back_populates="user_name")
    comment = Relationship("Comment", back_populates="user_comment")
    like = Relationship("Like", backref="users")
    rating = Relationship("Rating", back_populates="user_rating")
    sales = Relationship("Sale", back_populates="user_name")


class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(100))
    price = db.Column(db.Float)
    total_price = db.Column(db.Float)
    quantity = db.Column(db.Integer)
    buyer_quantity = db.Column(db.Integer)
    category = db.Column(db.String(100))
    image_url = db.Column(JSON)
    image_binary = db.Column(JSON)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    rating = db.Column(db.Float)
    all_rating = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user_name = Relationship("User", back_populates="posts")

    comment = Relationship("Comment", back_populates="user_product_comment")
    user_rating = Relationship("Rating", back_populates="user_product_rating")


class Comment(db.Model):
    __tablename__ = "comments"
    id = db.Column(db.Integer, primary_key=True)
    file = db.Column(db.String)
    heading = db.Column(db.String)
    review = db.Column(db.String)
    rating = db.Column(db.String)
    date = db.Column(db.String)
    comment_id = db.Column(db.Integer)
    product_comment_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    user_product_comment = Relationship("Product", back_populates="comment")

    user_comment_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user_comment = Relationship("User", back_populates="comment")

    like = Relationship("Like", backref="comments")


class Rating(db.Model):
    __tablename__ = "ratings"
    id = db.Column(db.Integer, primary_key=True)
    comment_id = db.Column(db.Integer)
    rating = db.Column(db.Float)
    product_rating_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    user_product_rating = Relationship("Product", back_populates="user_rating")

    user_rating_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user_rating = Relationship("User", back_populates="rating")


class Like(db.Model):
    __tablename__ = "likes"
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.Integer, db.ForeignKey("users.id"))
    comment_id = db.Column(db.Integer, db.ForeignKey("comments.id"))


class Addcart(db.Model):
    __tablename__ = "addcart"
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer)
    title = db.Column(db.String(100))
    price = db.Column(db.Float)
    total_price = db.Column(db.Float)
    quantity = db.Column(db.Integer)
    buyer_quantity = db.Column(db.Integer)
    category = db.Column(db.String(100))
    image_url = db.Column(JSON)
    rating = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user_name = Relationship("User", back_populates="addcart")


class Sale(db.Model):
    __tablename__ = "sales"
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer)
    title = db.Column(db.String(100))
    price = db.Column(db.Float)
    total_price = db.Column(db.Float)
    quantity = db.Column(db.Integer)
    buyer_quantity = db.Column(db.Integer)
    category = db.Column(db.String(100))
    image_url = db.Column(JSON)
    rating = db.Column(db.Integer)
    date = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user_name = Relationship("User", back_populates="sales")


class Setting(db.Model):
    __tablename__ = "settings"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    number = db.Column(db.String(11))
    address = db.Column(db.String(100))
    city = db.Column(db.String(100))
    zipcode = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user_name = Relationship("User", back_populates="settings")
