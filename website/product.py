from flask import Blueprint, request, render_template, json
from flask_login import current_user
from os.path import realpath
from .models import Product, Addcart
from sqlalchemy import desc
from .setting import only_admin
from . import db
product = Blueprint("product", __name__)


def products(data):
    try : 
        return {
            "id": data.id,
            "title": data.title,
            "price": data.price,
            "category": data.category,
            "quantity": data.quantity,
            "image_url": data.image_url,
            "image_binary" : data.image_binary,
            "rating" : sum([rating.rating for rating in data.user_rating])/len([rating.rating for rating in data.user_rating]),
            "star_rating" : (sum([rating.rating for rating in data.user_rating])/len([rating.rating for rating in data.user_rating]) * 5) / 100,
            "all_rating" : [rating.rating for rating in data.user_rating]
        }
    except ZeroDivisionError:
        return {
            "id": data.id,
            "title": data.title,
            "price": data.price,
            "category": data.category,
            "quantity": data.quantity,
            "image_url": data.image_url,
            "image_binary" : data.image_binary,
            "rating" : 0,
            "star_rating" : 0.0,
            "all_rating" : [rating.rating for rating in data.user_rating]
        }

@product.route("/post-product")
def post_product():
    
    return render_template("post_product.html", current_user=current_user)

@product.route("/added_product")
def added_product():
    productArr = Product.query.all()
    
    return {"results": [products(data) for data in productArr]} 

@product.route("/fetch-product")
def fetch_product():
    productArr = Product.query.all()[:8]
    
    return {"results": [products(data) for data in productArr]}

@product.route("/popular-product")
def popular_product():
    productArr = Product.query.order_by(desc(Product.rating)).all()[:4]
    return {"results": [products(data) for data in productArr]}

@product.route("/add-product", methods=["GET", "POST"])
@only_admin
def add_product():
    all_product = Product.query.all()
    if request.method == "POST":
        title = request.form["title"].title()
        category = request.form["category"]
        price = request.form["price"]
        quantity = request.form["quantity"]
        file = request.files.getlist("file")
        filetitle = request.form.getlist("filtitle")
        image_binary = request.form.getlist("image_binary")
        if title == "":
            return {"message": "Title is empty"}
        elif category == "":
            return {"message": "Title is empty"}
        elif price == "":
            return {"message": "Title is empty"}
        else:
            fileData = [[filetitle[f].title(), file[f].filename]
                        for f in range(len(file))]
            for f in file:
                f.save(realpath(f"website/static/img/{f.filename}"))
            new_product = Product(
                title=title,
                category=category,
                price=price,
                quantity=quantity,
                rating=0,
                image_binary={"fileResult" : image_binary},
                image_url={
                    "title": fileData
                },
                user_name=current_user
            )
            db.session.add(new_product)
            db.session.commit()
            return {"results": products(new_product), "len" : len(all_product)}

@product.route("/edit-product", methods=["GET", "POST"])
def edit_product():
    id = request.args.get("q")
    product_item = Product.query.get(id)

    return {"results" : products(product_item), "len" : product_item.image_binary}


@product.route("/toedit-product", methods=["GET", "POST"])
@only_admin
def toEdit_product():
    id = request.args.get("q")
    product_item = Product.query.get(id)

    title = request.form["title"].title()
    category = request.form["category"]
    price = request.form["price"]
    quantity = request.form["quantity"]
    file = request.files.getlist("file")
    filetitle = request.form.getlist("filtitle")
    image_binary = request.form.getlist("image_binary")
    fileData = [[filetitle[f].title(), file[f].filename] for f in range(len(file))]
    for f in file:
        f.save(realpath(f"website/static/img/{f.filename}"))

    product_item.title = title
    product_item.category = category
    product_item.price = price
    product_item.quantity = quantity
    product_item.image_url = {"title": fileData}
    product_item.image_binary = {"fileResult" : image_binary}
    product_item.user_name = current_user

    db.session.commit()
    return {"results" : products(product_item), "len" : product_item.image_binary}


@product.route("/delete-product")
@only_admin
def delete_product():
    id = request.args.get("delete")
    delete_item = Product.query.get(id)
    delete_addcart_item = Addcart.query.filter(Addcart.product_id == int(id)).first()
    if delete_addcart_item:
        db.session.delete(delete_addcart_item)
    db.session.delete(delete_item)
    db.session.commit()
    return {"results" : "Deleted"}