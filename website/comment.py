from flask import Blueprint, request
from flask_login import current_user, login_required
from .models import Comment, Product, Like, Rating
from . import db
from os.path import realpath
from datetime import datetime

comment = Blueprint("comment", __name__)


def commentData(data):
    return {
        "user_id": 0 if not current_user.is_authenticated else current_user.id,
        "user_in": data.comment_id,
        "id": data.id,
        "name": data.user_comment.name,
        "image_url": data.file,
        "heading": data.heading,
        "rating": data.rating,
        "review": data.review,
        "date": data.date,
        "like": [{"author": comment.author} for comment in data.like],
        "liked": current_user.id in map(lambda x: x.author, data.like) if current_user.is_authenticated else ""
    }


@comment.route("/product-comment")
def product_comment():
    id = request.args.get("product")
    product = Product.query.get(id).comment
    return {"results": [commentData(comment) for comment in product]}


@comment.route("/comment", methods=["GET", "POST"])
def post_comment():

    if request.method == "POST":
        id = int(request.args.get("productId"))
        product = Product.query.get(id)
        ratings = product.user_rating
        user_authenticated = current_user.is_authenticated

        if not user_authenticated:
            return {"authenticated": user_authenticated}
        else:

            file = request.files.get("fileComment")
            headline = request.form.get("headline")
            review = request.form.get("review")
            rating = request.form.get("rating")
            percentage_product = 0
            if rating == "⭐":
                percentage_product = 20
            elif rating == "⭐⭐":
                percentage_product = 40
            elif rating == "⭐⭐⭐":
                percentage_product = 60
            elif rating == "⭐⭐⭐⭐":
                percentage_product = 80
            elif rating == "⭐⭐⭐⭐⭐":
                percentage_product = 100

            try:
                file.save(realpath(f"website/static/img/{file.filename}"))
                new_comment = Comment(
                    file=file.filename,
                    heading=headline,
                    review=review,
                    rating=rating,
                    date=datetime.now().strftime("%d %B %Y"),
                    comment_id=current_user.id,
                    user_product_comment=product,
                    user_comment=current_user
                )
            except AttributeError:
                new_comment = Comment(
                    heading=headline,
                    review=review,
                    rating=rating,
                    date=datetime.now().strftime("%d %B %Y"),
                    comment_id=current_user.id,
                    user_product_comment=product,
                    user_comment=current_user
                )

            db.session.add(new_comment)
            db.session.commit()

            product_rating = Rating(
                rating=percentage_product,
                comment_id=new_comment.id,
                user_product_rating=product,
                user_rating=current_user
            )
            db.session.add(product_rating)
            db.session.commit()
            return {"message": "Success", "results": commentData(new_comment)}
    return {"message": "Success"}


@comment.route("/like-comment", methods=["GET", "POST"])
def like_comment():
    id = request.args.get("like")

    if current_user.is_authenticated:
        comment = Comment.query.filter_by(id=id).first()
        likeComment = Like.query.filter_by(
            author=current_user.id, comment_id=id).first()
        if not comment:
            return {"message": "Comment does not exists."}
        elif likeComment:
            db.session.delete(likeComment)
            db.session.commit()
            return {"results": {"like": len(comment.like), "liked": current_user.id in map(lambda x: x.author, comment.like)}}
        else:
            like = Like(
                author=current_user.id,
                comment_id=id)
            db.session.add(like)
            db.session.commit()
            return {"results": {"like": len(comment.like), "liked": current_user.id in map(lambda x: x.author, comment.like)}}
    else:
        return {"is_authenticated": current_user.is_authenticated}


# edit comment
@comment.route("/edit-comment", methods=["GET", "POST"])
def edit_comment():
    id = int(request.args.get("edit"))
    comment = Comment.query.get(id)

    return {"message": "Data", "results": commentData(comment)}


@comment.route("/submit-edit-comment", methods=["GET", "POST"])
def edit_comment_data():
    id = request.args.get("edit")
    comment = Comment.query.get(int(id))
    file = request.files.get("fileComment")
    headline = request.form.get("headline")
    review = request.form.get("review")
    rating = request.form.get("rating")
    product_id = request.form.get("product_id")
    percentage_product = 0

    if rating == "⭐":
        percentage_product = 20
    elif rating == "⭐⭐":
        percentage_product = 40
    elif rating == "⭐⭐⭐":
        percentage_product = 60
    elif rating == "⭐⭐⭐⭐":
        percentage_product = 80
    elif rating == "⭐⭐⭐⭐⭐":
        percentage_product = 10

    try:
        file.save(realpath(f"website/static/img/{file.filename}"))
        comment.file = file.filename
        comment.heading = headline
        comment.review = review
        comment.rating = rating
    except AttributeError:
        comment.heading = headline
        comment.review = review
        comment.rating = rating

    # also update rating status
    update_rating = Rating.query.filter_by(comment_id=id).first()
    update_rating.rating = percentage_product

    db.session.commit()
    return {"results": commentData(comment)}

# delete comment


@comment.route("/delete-comment", methods=["GET", "POST"])
def delete_comment():
    id = int(request.args.get("comment"))
    comment_delete = Comment.query.get(id)
    like_delete = Like.query.filter_by(comment_id=id).all()
    rating_num = Rating.query.filter_by(
        comment_id=comment_delete.id).first()

    for like in like_delete:
        db.session.delete(like)
    db.session.delete(comment_delete)
    db.session.delete(rating_num)
    db.session.commit()

    return {"message": "Deleted"}
