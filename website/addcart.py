from flask import Blueprint, render_template, redirect, url_for, request
from flask_login import current_user
from .models import Addcart, Product, Sale
from .setting import need_to_authenticate
from . import db
from datetime import datetime

addcart = Blueprint("addcart", __name__)


def add_cart_product(data):
    return {
        "id": data.id,
        "title": data.title,
        "price": data.price,
        "category": data.category,
        "quantity": data.quantity,
        "buyer_quantity": data.buyer_quantity,
        "total_price": data.total_price,
        "image_url": data.image_url,
    }


@addcart.route("/products-to-cart")
def productData():
    id = request.args.get("products")
    productData = Product.query.get(id)

    return {"results": add_cart_product(productData)}


@addcart.route("/checkout", methods=["GET", "POST"])
@need_to_authenticate
def checkout():
    id = request.args.get("product_id")
    product_item = Addcart.query.get(id)
    delivery_fee = 100
    return render_template("checkout.html", delivery_fee=delivery_fee,
                           current_user=current_user,
                           product_item=product_item,
                           )


@addcart.route("/list-checkout", methods=["GET", "POST"])
def list_checkout():
    list_id = request.args.getlist("list_id")
    delivery_fee = 100
    if list_id:
        addcart_id = Addcart.query.filter(Addcart.id.in_(list_id)).all()
        subtotal = 0
        total_pay = 0
        for product in range(len(addcart_id)):
            subtotal += addcart_id[product].total_price
            total_pay = subtotal + delivery_fee
        return render_template("checkout.html",
                               orders=addcart_id, subtotal=subtotal, delivery_fee=delivery_fee,
                               total_pay=total_pay, current_user=current_user,
                               list_buy_product_id=list_id
                               )


@addcart.route("/checkout-item", methods=["GET", "POST"])
@need_to_authenticate
def checkout_item():
    list_buy_product_id = request.args.getlist("id")
    buy_id = list_buy_product_id[0]
    buy_image_pos = list_buy_product_id[1]
    image_filename = list_buy_product_id[2]
    buy_item = Product.query.get(buy_id)

    subtotal = buy_item.total_price
    delivery_fee = 100
    total_pay = 0
    total_pay = subtotal + delivery_fee
    return render_template("checkout.html",
                           total_pay=total_pay, current_user=current_user,
                           subtotal=subtotal,
                           delivery_fee=delivery_fee,
                           buy_item=buy_item,
                           image_pos=int(buy_image_pos),
                           image_filename=int(image_filename),
                           )


@addcart.route("/proceed-checkout", methods=["GET", "POST"])
@need_to_authenticate
def proceed_checkout():
    id = request.args.get("id")

    single_cart_id = request.args.get("singleCart")

    if id:
        product_id = Product.query.get(id)
        addcart_data_item = Addcart.query.filter_by(
            product_id=product_id.id).first()
        image_pos = request.json["imagePos"]
        image_filename = request.json["imageFilename"]

        # less the product quantity

        product_id.quantity -= product_id.buyer_quantity

        if addcart_data_item:
            addcart_data_item.quantity -= product_id.buyer_quantity

        checkout_product = Sale(
            product_id=product_id.id,
            title=product_id.title,
            price=product_id.price,
            total_price=product_id.total_price,
            quantity=product_id.quantity,
            buyer_quantity=product_id.buyer_quantity,
            category=product_id.category,
            image_url=product_id.image_url["title"][int(
                image_pos)][int(image_filename)],
            rating=product_id.rating,
            user_name=current_user,
            date=datetime.now().strftime("%Y-%m-%d")
        )
        db.session.add(checkout_product)
        db.session.commit()
    elif single_cart_id:
        addcart_item = Addcart.query.get(single_cart_id)
        product_item = Product.query.filter_by(
            id=addcart_item.product_id).first()

        addcart_item.quantity -= addcart_item.buyer_quantity

        if product_item:
            product_item.quantity -= addcart_item.buyer_quantity

        single_addcart_checkout = Sale(
            title=addcart_item.title,
            price=addcart_item.price,
            total_price=addcart_item.total_price,
            quantity=addcart_item.quantity,
            buyer_quantity=addcart_item.buyer_quantity,
            category=addcart_item.category,
            image_url=addcart_item.image_url[1],
            rating=addcart_item.rating,
            date=datetime.now().strftime("%Y-%m-%d"),
            user_name=current_user
        )
        db.session.add(single_addcart_checkout)
        db.session.commit()
    else:
        list_id = list(
            eval("".join([itemId for itemId in request.args.getlist("checkoutId")])))
        list_addcart_product = Addcart.query.filter(
            Addcart.id.in_(list_id)).all()

        list_product_id = [
            product.product_id for product in list_addcart_product]
        list_product = Product.query.filter(
            Product.id.in_(list_product_id)).all()

        # minus the addcart quantity
        for addcart in list_addcart_product:
            addcart.quantity -= addcart.buyer_quantity

        # minus the product quantity
        if list_product:
            for product in range(len(list_product)):
                list_product[product].quantity -= list_addcart_product[product].buyer_quantity

        list_product = [
            Sale(
                title=item.title,
                price=item.price,
                total_price=item.total_price,
                quantity=item.quantity,
                buyer_quantity=item.buyer_quantity,
                category=item.category,
                image_url=item.image_url[1],
                rating=item.rating,
                date=datetime.now().strftime("%Y-%m-%d"),
                user_name=current_user
            )for item in list_addcart_product]
        db.session.add_all(list_product)
        db.session.commit()

    return {"message": "Success"}


@addcart.route("/shopping-pay", methods=["GET", "POST"])
@need_to_authenticate
def mastercard():
    # product id
    list_id = request.args.getlist("list_id")
    id = request.args.get("addcart_id")
    product_id = request.args.getlist("product_id")
    # check if product in a list of database
    addcart_id = Addcart.query.filter(Addcart.id.in_(list_id)).all()
    addcart_item = Addcart.query.get(id)
    try:
        product_item = Product.query.get(product_id[0])
        product_item_imagepos = int(product_id[1])
        product_item_filename = int(product_id[2])

    except IndexError:
        product_item = ""
        product_item_imagepos = ""
        product_item_filename = ""
    return render_template("mastercard.html", orders=addcart_id,
                           product_item=product_item,
                           addcart_item=addcart_item,
                           product_item_imagepos=product_item_imagepos,
                           product_item_filename=product_item_filename,
                           addcart_list_id=list_id,
                           )


@addcart.route("/mastercard-form-data", methods=["GET", "POST"])
def mastercard_form():
    if request.method == "POST":
        cardNumber = request.form["cardNumber"]
        CardHolderName = request.form["CardHolderName"]
        cardExpDate = request.form["cardExpDate"]
        cardCvv = request.form["cardCvv"]

        if cardNumber == "":
            return {"message": "Card number is empty."}
        elif CardHolderName == "":
            return {"message": "Card holder name is empty."}
        elif cardExpDate == "":
            return {"message": "Card Expiration date is empty."}
        elif cardCvv == "":
            return {"message": "Card CVV is empty."}

        return render_template("mastercard.html", cardNumber=cardNumber, CardHolderName=CardHolderName, cardExpDate=cardExpDate, cardCvv=cardCvv)


@addcart.route("/single-payment-cart", methods=["GET", "POST"])
@need_to_authenticate
def single_payment_cart():
    id = int(request.args.get("id"))
    item_id = Addcart.query.get(id)
    delivery_fee = 100

    if request.form.get("payment-cart"):
        if request.method == "POST":
            if id:
                choose_payment = request.form.get("radioNoLabel")
                if choose_payment == "cod":
                    return redirect(url_for("addcart.checkout", product_id=id))
                else:
                    return redirect(url_for("addcart.mastercard", addcart_id=id))

    return render_template("singleCart.html", product=item_id, courier=delivery_fee)


@addcart.route("/payment-cart", methods=["GET", "POST"])
@need_to_authenticate
def payment_cart():
    back = request.referrer

    if len(current_user.settings) == 0:  # check if user has address
        return redirect(url_for("setting.user_address"))
    list_id = list(
        eval("".join([itemId for itemId in request.args.getlist("addcart")])))

    addcart_id = Addcart.query.filter(Addcart.id.in_(list_id)).all()

    subtotal = 0
    delivery_fee = 100
    total_pay = 0

    for product in range(len(addcart_id)):
        subtotal += addcart_id[product].total_price
        total_pay = subtotal + delivery_fee

    if request.form.get("payment-cart"):
        if request.method == "POST":
            if list_id:
                choose_payment = request.form.get("radioNoLabel")
                if choose_payment == "cod":
                    return redirect(url_for("addcart.list_checkout", list_id=list_id))
                else:
                    return redirect(url_for("addcart.mastercard", list_id=list_id))

    return render_template(
        "buycart.html",
        orders=addcart_id,
        courier=delivery_fee,
        total_pay=total_pay,
        current_user=current_user,
        back=back
    )


@addcart.route("/addcart-data")
def allAddcartData():
    try:
        addcarts = current_user.addcart
    except AttributeError:
        addcarts = ""

    if not current_user.is_authenticated:
        return {"results": [add_cart_product(product) for product in addcarts], "len": "", "authenticated": current_user.is_authenticated}
    return {
        "results": [add_cart_product(product) for product in addcarts],
        "len": "" if len(addcarts) == 0 else len(addcarts),
        "authenticated": current_user.is_authenticated
    }


@addcart.route("/add-cart", methods=["GET", "POST"])
def add_cart():
    if request.method == "POST":
        if not current_user.is_authenticated:
            return {"is_authenticated": current_user.is_authenticated}
        else:
            if len(current_user.settings) != 0:
                id = request.args.get("q")
                flavour = request.json["flavour"]
                get_product = Product.query.get(id)
                new_cart = Addcart(
                    product_id=get_product.id,
                    title=get_product.title,
                    price=get_product.price,
                    total_price=get_product.total_price,
                    quantity=get_product.quantity,
                    buyer_quantity=get_product.buyer_quantity,
                    category=get_product.category,
                    image_url=get_product.image_url["title"][int(flavour)],
                    user_name=current_user
                )
                db.session.add(new_cart)
                db.session.commit()
                return {"message": "Cart Added", "results": add_cart_product(new_cart), "len": len(current_user.addcart)}
            else:
                return {"message": "No settings"}


# single cart
@addcart.route("/single-cart", methods=["GET", "POST"])
@need_to_authenticate
def addcart_single():

    if request.method == "POST":
        if len(current_user.settings) == 0:
            return {"message": "No settings"}
        id = int(request.args.get("id"))
        singleProduct = Addcart.query.get(id)
        if singleProduct.quantity <= 0:
            return {"message": f"{singleProduct.title} Out of Stocks"}
        else:
            quantityItem = request.json["singleCart"]
            singleProduct.total_price = singleProduct.price * int(quantityItem)
            singleProduct.buyer_quantity = int(quantityItem)
            db.session.commit()
            if singleProduct.quantity < singleProduct.buyer_quantity:
                return {"message": "Your order quantity is greater than the item quantity", "quantity": singleProduct.quantity}
            return {"message": "Success"}

# addcart list


@addcart.route("/list-cart", methods=["GET", "POST"])
@need_to_authenticate
def addcart_list():
    list_id = list(
        eval("".join([itemId for itemId in request.args.getlist("addcart")])))
    addcart_id = Addcart.query.filter(Addcart.id.in_(list_id)).all()
    if request.method == "POST":
        # check if buyer has address
        if len(current_user.settings) == 0:
            return {"message": "No settings"}
        quantityItem = request.json["cartQuantity"]
        for quantity in range(len(quantityItem)):
            if addcart_id[quantity].quantity <= 0:
                return {
                    "message": "Out of stocks",
                    "quantity": f"{addcart_id[quantity].title} Out of stocks"
                }
            else:
                addcart_id[quantity].total_price = addcart_id[quantity].price * \
                    int(quantityItem[quantity])
                addcart_id[quantity].buyer_quantity = int(
                    quantityItem[quantity])
                db.session.commit()

                # check if item quantity is less than buyer quantity
                if addcart_id[quantity].quantity < addcart_id[quantity].buyer_quantity:
                    return {
                        "message": "Your order quantity is greater than the item quantity",
                        "quantity": f"{addcart_id[quantity].title} have {addcart_id[quantity].quantity}pcs. quantity left. Lessen your order"
                    }

        return {"message": "Success"}


@addcart.route("/check-to-buy", methods=["GET", "POST"])
@need_to_authenticate
def buy():
    list_id = list(
        eval("".join([itemId for itemId in request.args.getlist("id")])))
    id = list_id[0]
    image_pos = list_id[1]
    image_filename = list_id[2]
    buy_product = Product.query.get(id)

    subtotal = 0
    delivery_fee = 100
    total_pay = 0

    subtotal += buy_product.total_price
    total_pay = subtotal + delivery_fee

    if request.form.get("payment-cart"):
        if request.method == "POST":
            choose_payment = request.form.get("radioNoLabel")
            if choose_payment == "cod":
                return redirect(url_for("addcart.checkout_item", id=list_id))
            else:
                return redirect(url_for("addcart.mastercard", product_id=list_id))

    return render_template("buy.html", buy_product=buy_product, image_pos=image_pos, image_filename=image_filename, total=total_pay, courier=delivery_fee)


@addcart.route("/buy-product", methods=["GET", "POST"])
def buy_product():
    if current_user.is_authenticated:
        # check if buyer has address
        if len(current_user.settings) == 0:
            return {"message": "No settings"}

        id = request.args.get("id")
        buy_product = Product.query.get(id)

        quantityItem = request.json["quantity"]
        buy_product.buyer_quantity = int(quantityItem)
        db.session.commit()

        if buy_product.quantity <= 0:
            return {"message": "Product is out of quantity"}
        elif buy_product.quantity < buy_product.buyer_quantity:
            return {"message": "Lessen your quantity"}
        else:
            addcart_product = Addcart.query.filter_by(
                product_id=int(id)).first()
            if addcart_product:
                addcart_product.quantity -= int(quantityItem)
            quantityItem = request.json["quantity"]
            buy_product.total_price = buy_product.price * int(quantityItem)
            buy_product.buyer_quantity = int(quantityItem)
            db.session.commit()
            return {"message": "Success"}
    else:
        return {"authenticated": current_user.is_authenticated}


@addcart.route("/delete-cart")
@need_to_authenticate
def delete_cart():
    id = request.args.get("delete")
    delete_id = Addcart.query.get(id)
    db.session.delete(delete_id)
    db.session.commit()
    return {"message": f"{delete_id.title} has been deleted.", "len": len(current_user.addcart)}
