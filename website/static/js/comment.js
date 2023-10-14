window.onload = () => {
    productCommentData()
}


let productId = document.querySelector(".productId");
let commentDataSection = document.querySelector("#commentDataSection");
document.querySelector("#commentSection").addEventListener("submit", e => {
    e.preventDefault()

    let fileComment = document.querySelector("#fileComment")
    let headline = document.querySelector("#headline")
    let review = document.querySelector("#review")
    let rating = document.querySelector("#rating")

    let newComment = new FormData()
    newComment.append("fileComment", fileComment.files[0])
    newComment.append("headline", headline.value)
    newComment.append("review", review.value)
    newComment.append("rating", rating.value)
    newComment.append("product_id", productId.id)
    fetch(`/comment?productId=${productId.id}`, {
        method : "POST",
        body : newComment
    }).then(res => res.json())
    .then(res => {
        if (res["authenticated"] === false){
            location.replace("/login")
        }
        commentHtml(res["results"])
        
        
    }).catch(err => console.log(err))

    document.querySelector("#commentSection").reset()
})

const productCommentData = () => {
    
    fetch(`/product-comment?product=${productId.id}`)
    .then(res => res.json())
    .then(res => {
            let comments = res["results"]
            if (comments == true){
            comments.forEach(comment => {
                commentHtml(comment)
            })
            }else{
                comments.forEach(comment => {
                    commentHtml(comment)
                })
            }
    })
}
let commentOutput = ""
const commentHtml = (data) => {
    commentOutput += `
        <div class="row border-bottom py-4" id="${data.id}">
                            
        <div class="col-lg-1 avatar rounded-circle bg-warning ">
        ${data.name[0]}
        </div>
        <div class="col comment">
        <h5 class="mb-1">
            ${data.name}
        </h5>
        <p class="small"> <span class="text-muted">${data.date}</span>
        </p>
        <h6 class=""> ${data.rating} <span>${data.heading}</span></h6>
        <p>${data.review}</p>
        ${data.image_url ? 
            `
            <div class="img d-flex">
                <div class="m-2">
                <img src="/static/img/${data.image_url}" width="100" alt="${data.image_url}">
                </div>
            </div>
            `
        :

            `
            `
        }

        <div class="update pt-3 d-flex justify-content-between">
            <div class="likeBtn">
            ${data.like.length == 0? 
                
                `
                <span id="like-count${data.id}" class="like-count">${ data.like.length }</span>
                <a class="like-btn text-dark like" id="${data.id}">
                    <i onclick="likeButton(${data.id})" id="likeId${data.id}" class="bi bi-hand-thumbs-up likeComment"></i>
                </a>
                `
                
            :
                `
                <span id="like-count${data.id}" class="like-count text-success">${ data.like.length }</span>   
                <a class="like-btn text-dark like" id="${data.id}">
                    <i onclick="likeButton(${data.id})" id="likeId${data.id}" class="bi bi-hand-thumbs-up-fill likeComment text-success"></i>
                </a>
                `
            }
            
            </div>
            <div class="nav-item dropdown me-4">
            <a class="nav-link" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
            </a>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
            </div>
        </div>
        </div>
        
    </div>
    `
    commentDataSection.innerHTML = commentOutput
}

let likeButton = (id) => {

    let likeBtnSvg = document.querySelector(`#likeId${id}`)
    let likeCount = document.querySelector(`#like-count${id}`)
    fetch(`/like-comment?like=${id}`, {method : "POST"})
    .then(res => res.json())
    .then(res => {
        if(res["is_authenticated"] == false){
            location.replace("/login")
        }
        likeCount.innerHTML = res["results"].like
        if (res["results"].liked === true){
            likeBtnSvg.className = "bi bi-hand-thumbs-up-fill likeComment text-success"
        }else{
            likeBtnSvg.className = "bi bi-hand-thumbs-up likeComment text-dark"
            
        }
    });
}
