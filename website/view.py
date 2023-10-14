from flask import Blueprint, render_template, redirect, url_for, request
from flask_login import current_user
from sqlalchemy import desc
from .models import Product, Sale
from . import db
from .setting import need_to_authenticate, only_admin
from .addcart import add_cart_product
from datetime import datetime

view = Blueprint("view", __name__)


@view.route("/", methods=["GET", "POST"])
def home():
    try:
        all_product = db.session.query(
            Product).order_by(desc(Product.id)).all()
        post_product = Product.query.all()

    except IndexError:
        all_product = ""
        post_product = ""

    return render_template("index.html", current_user=current_user, posts=post_product, categories=all_product)


@view.route("/dashboard")
@need_to_authenticate
@only_admin
def dashboard():
    return render_template("dashboard.html")

@view.route("/dashboard-sales-product")
@only_admin
def sales_products():

    sales = Sale.query.all()

    return {"results" : [add_cart_product(sale) for sale in sales]}

@view.route("/dashboard-calculated-items", methods=["GET", "POST"])
@only_admin
def dashboad_calc():
    income = db.session.query(db.func.sum(Sale.total_price), Sale.category).group_by(Sale.category).order_by(Sale.category).all()
    income_data = [total_amount for total_amount, _ in income]
    income_category = [category for _, category in income]

    default_datetime = datetime.now().strftime("%Y-%m-%d")
    income_date = Sale.query.filter(Sale.date.like(f"%{default_datetime}%")).all()
    day_income = [int(income.total_price) for income in income_date]

    return {"income" : income_data, 
            "category" :  income_category, 
            "default_datetime" : default_datetime, 
            "day_income" : day_income
        }

@view.route("/filter-by-date", methods=["GET", "POST"])
@need_to_authenticate
@only_admin
def filter_by_date():
    income_by_date = db.session.query(db.func.sum(Sale.total_price), Sale.date).group_by(Sale.date).order_by(Sale.date).all()
    date = [date.strftime("%Y-%m-%d") for _,date in income_by_date]
    if request.method == "POST":
        filter_by_date = request.json["date"]
        income_date = Sale.query.filter(Sale.date.like(f"%{filter_by_date}%")).all()
        day_income = [int(income.total_price) for income in income_date]
        if filter_by_date in date:
            date = filter_by_date
        return {"income_by_date" : day_income, "date" : date}


@view.route("/products", methods=["GET", "POST"])   
def product():
    posts = reversed(Product.query.all())
    return render_template("product.html", posts=posts, current_user=current_user)


@view.route("/preview", methods=["GET", "POST"])
def preview():
    try:
        back = request.referrer
        id = request.args.get("q")
        posts = Product.query.get(id)
        ratings = posts.user_rating
        related_product = Product.query.filter_by(
            category=posts.category).all()

    except AttributeError:
        return redirect(url_for("view.home"))
    
    try:
        product_rating = [rating.rating for rating in ratings]
        calculated_rating = sum(product_rating)/len(product_rating)
        rating_number = (calculated_rating * 5) / 100
    except:
        calculated_rating = 0
        rating_number = 0
    
    posts.rating = calculated_rating
    db.session.commit()

    if request.form.get("btn") == "Buy":
        if request.method == "POST":
            posts.buyer_quantity = request.form.get("item_quantity")
            posts.total_price = posts.price * int(posts.buyer_quantity)
            db.session.commit()
            return redirect(url_for("addcart.payment_cart", id=id))

    return render_template("preview.html", id=id, posts=posts, current_user=current_user, 
                           rating=calculated_rating, rating_num=rating_number, 
                           related_product=related_product, back=back)

@view.route("/posted-product")
def posted_products():
    return render_template("posted_product.html")


@view.route("/preview-carousel")
@need_to_authenticate
def prev_carousel():
    return {"message" : "Success"}

@view.route("/search-product", methods=["GET", "POST"])
def search():
    search_data = request.json["search"]
    search_product = Product.query.filter(Product.title.like(f"%{search_data}%")).all()

    return {"results" : [{
        "id" : search.id,
        "title" : search.title,
        "category" : search.category,
        "image_url" : search.image_url
    } for search in search_product]} 