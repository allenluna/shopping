let productId = document.querySelector(".productId");
let commentDataSection = document.querySelector("#commentDataSection");
document.querySelector("#postCommentData").addEventListener("click", (e) => {
  e.preventDefault();

  let fileComment = document.querySelector("#fileComment");
  let headline = document.querySelector("#headline");
  let review = document.querySelector("#review");
  let rating = document.querySelector("#rating");

  let newComment = new FormData();
  newComment.append("fileComment", fileComment.files[0]);
  newComment.append("headline", headline.value);
  newComment.append("review", review.value);
  newComment.append("rating", rating.value);
  newComment.append("product_id", productId.id);
  fetch(`/comment?productId=${productId.id}`, {
    method: "POST",
    body: newComment,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res["authenticated"] === false) {
        location.replace("/login");
      }
      commentHtml(res["results"]);
    });

  document.querySelector("#commentSection").reset();
});

const productCommentData = () => {
  fetch(`/product-comment?product=${productId.id}`)
    .then((res) => res.json())
    .then((res) => {
      let comments = res["results"];
      if (comments == true) {
        comments.forEach((comment) => {
          commentHtml(comment);
        });
      } else {
        comments.forEach((comment) => {
          commentHtml(comment);
        });
      }
    });
};

productCommentData();
// console.log(data.name[0]);
let commentOutput = "";
const commentHtml = (data) => {
  commentOutput += `
        <div class="row border-bottom py-4 commentCard${data.id}" id="${
    data.id
  }">
                            
        <div class="col-lg-1 avatar rounded-circle bg-warning ">
        ${data.name[0]}
        </div>
        <div class="col comment">
        <h5 class="mb-1">
            ${data.name}
        </h5>
        <p class="small date${data.id}"> <span class="text-muted ">${
    data.date
  }</span>
              </p>
              <h6 class="rating${data.id}"> ${
    data.rating
  } <span class="heading${data.id}">${data.heading}</span></h6>
    
        <p class="review${data.id}">${data.review}</p>
        ${
          data.image_url
            ? `
            <div class="img d-flex">
                <div class="m-2 image_data${data.id}">
                <img src="/static/img/${data.image_url}" width="100">
                </div>
            </div>
            `
            : `
            <div class="img d-flex">
                <div class="m-2 image_data${data.id}">
                </div>
            </div>
            `
        }

        <div class="update pt-3 d-flex justify-content-between">
            <div class="likeBtn">
            ${
              data.like.length == 0
                ? `
                <span id="like-count${data.id}" class="like-count">${data.like.length}</span>
                <a class="like-btn text-dark like" id="${data.id}">
                    <i onclick="likeButton(${data.id})" id="likeId${data.id}" class="bi bi-hand-thumbs-up likeComment"></i>
                </a>
                `
                : `
                <span id="like-count${data.id}" class="like-count text-success">${data.like.length}</span>   
                <a class="like-btn text-dark like" id="${data.id}">
                    <i onclick="likeButton(${data.id})" id="likeId${data.id}" class="bi bi-hand-thumbs-up-fill likeComment text-success"></i>
                </a>
                `
            }
            
            </div>
            ${
              data.user_in === data.user_id
                ? `
            <div class="nav-item dropdown me-4">
            <a class="nav-link" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
            </a>
              <ul class="dropdown-menu">
                    <li>
                      <a class="dropdown-item myProdEdit updateComment" id=${data.id} href="#commentSection">
                      <i id="${data.id}" class="bi bi-pencil-square myProdEdit updateComment" ></i>
                        Edit
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item myProdDelete deleteComment" id=${data.id}  data-bs-toggle="modal" data-bs-target="#deleteComment">
                      <i id="${data.id}" class="bi bi-trash3 myProdDelete deleteComment"></i>
                        Delete
                      </a>
                    </li>
                  </ul>
                  
              
            </div> `
                : ""
            }
        </div>
        </div>
        
    </div>
    `;
  commentDataSection.innerHTML = commentOutput;
};

// LIKE FUNCTION
let likeButton = (id) => {
  let likeBtnSvg = document.querySelector(`#likeId${id}`);
  let likeCount = document.querySelector(`#like-count${id}`);
  fetch(`/like-comment?like=${id}`, { method: "POST" })
    .then((res) => res.json())
    .then((res) => {
      if (res["is_authenticated"] == false) {
        location.replace("/login");
      }
      likeCount.innerHTML = res["results"].like;
      if (res["results"].liked === true) {
        likeBtnSvg.className =
          "bi bi-hand-thumbs-up-fill likeComment text-success";
      } else {
        likeBtnSvg.className = "bi bi-hand-thumbs-up likeComment text-dark";
      }
    });
};

// DELETE FUNCTION

let newDeleteId;
let editItemId;
commentDataSection.addEventListener("click", (e) => {
  let deleteId = e.target.classList.contains("deleteComment");
  let editId = e.target.classList.contains("updateComment");

  if (editId) {
    document.querySelector("#postCommentData").style.display = "none";
    document.querySelector("#editCommentData").style.display = "block";
    let fileComment = document.querySelector("#fileComment");
    let headline = document.querySelector("#headline");
    let review = document.querySelector("#review");
    let rating = document.querySelector("#rating");
    let editComment = new FormData();
    editComment.append("fileComment", fileComment.files[0]);
    editComment.append("headline", headline.value);
    editComment.append("review", review.value);
    editComment.append("rating", rating.value);
    fetch(`/edit-comment?edit=${e.target.id}`)
      .then((res) => res.json())
      .then((res) => {
        // this then is for fetching the the comment
        let result = res["results"];
        headline.value = result.heading;
        review.value = result.review;
        rating.value = result.rating;
      });

    // itemId
    editItemId = e.target.id;
  }
  if (deleteId) {
    newDeleteId = e.target.id;
  }
});

document.querySelector("#deleteComment").addEventListener("click", () => {
  fetch(`/delete-comment?comment=${newDeleteId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId.id }),
  })
    .then((res) => res.json())
    .then(() => {
      let commentCardDelete = document.querySelector(
        `.commentCard${newDeleteId}`
      );

      commentDataSection.removeChild(commentCardDelete);
    });
});

// this then is for updating the comment
document.querySelector("#editCommentData").addEventListener("click", (e) => {
  e.preventDefault();

  let fileComment = document.querySelector("#fileComment");
  let headline = document.querySelector("#headline");
  let review = document.querySelector("#review");
  let rating = document.querySelector("#rating");
  let editComment = new FormData();
  editComment.append("fileComment", fileComment.files[0]);
  editComment.append("headline", headline.value);
  editComment.append("review", review.value);
  editComment.append("rating", rating.value);
  editComment.append("product_id", productId.id);
  e.preventDefault();
  fetch(`/submit-edit-comment?edit=${editItemId}`, {
    method: "POST",
    body: editComment,
  })
    .then((res) => res.json())
    .then((res) => {
      let editCommentData = res["results"];
      // change html data
      let date = document.querySelector(`.date${editItemId}`);
      let rating = document.querySelector(`.rating${editItemId}`);
      let review = document.querySelector(`.review${editItemId}`);
      let image = document.querySelector(`.image_data${editItemId}`);
      date.innerHTML = `
      <span class="text-muted ">${editCommentData.date}</span>
      `;
      review.innerHTML = editCommentData.review;
      rating.innerHTML = `
      ${editCommentData.rating} <span class="heading${editCommentData.editItemId}">${editCommentData.heading}</span>
      `;
      if (editCommentData.image_url) {
        image.innerHTML = `
        <img src="/static/img/${editCommentData.image_url}" width="100">
        `;
      }
      document.querySelector("#postCommentData").style.display = "block";
      document.querySelector("#editCommentData").style.display = "none";
      document.querySelector("#commentSection").reset();
    });
});
