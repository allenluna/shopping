window.onload = () => {
  addImage(image1, label1);
  addImage(image2, label2);
  addImage(image3, label3);
  addImage(image4, label4);
  fetchData();
  allPopularProduct()
};

let popularProd = document.querySelector("#popProducts");
let featuredProd = document.querySelector("#featuredProd");
// add product
document.querySelector("#addProductForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let addData = formData();
  fetch("/add-product", {
    method: "POST",
    body: addData,
  })
    .then((res) => res.json())
    .then((res) => {
      if(res["len"] <= 3){
        popularProducts(res["results"]);
      }
      if(res["len"] <= 7){
        featuredProducts(res["results"]);
      }

      
    });

  // alert
  window.setTimeout(() => {
      $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
          $("#success-alert").slideUp(500);
              
      });
  });

  document.querySelector("#addProductForm").reset();
  label1.style.backgroundImage = `url(static/assets/addImage.png)`;
  label2.style.backgroundImage = `url(static/assets/addImage.png)`;
  label3.style.backgroundImage = `url(static/assets/addImage.png)`;
  label4.style.backgroundImage = `url(static/assets/addImage.png)`;
});


// popular product  
const allPopularProduct = () => {
  fetch("/popular-product")
  .then((res) => res.json())
  .then((res) => {
    let productArr = res["results"];

    for (let i = 0; i < productArr.length; i++) {
      popularProducts(productArr[i]);
    } 
  });
}

// fetch product from db
const fetchData = () => {
  fetch("/fetch-product")
    .then((res) => res.json())
    .then((res) => {
      let productArr = res["results"];
      for (let i = 0; i < productArr.length; i++) {
        featuredProducts(productArr[i]);
      } 
    });
};

// html elemets for Popular Products
const popularProducts = (data) => {
  let parentData = document.createElement("div");
  let a = document.createElement("a");
  a.setAttribute("class", "nav-link");
  a.href = "/products";
  a.innerHTML = `
              <div class="card hover-success ">
                <img src="static/img/${data.image_url.title[0][1]}" class="card-img-top image_url" alt="${data.title}">
                <div class="card-body cart-summary">
                  <p class="card-text text-secondary title">${data.title}</p>
                </div>
              </div>
        `;

  parentData.appendChild(a);
  popularProd.appendChild(parentData);
};

let featuredOutput = "";

const featuredProducts = (data) => {
  featuredOutput += `
  
  <div id="${data.id}" class="featuredData">
  <a class="nav-link linkData" href="${window.origin}/preview?q=${data.id}">
    <div class="card hover-success">
            <img
              src="static/img/${data.image_url.title[0][1]}"
              class="card-img-top p-lg-4 p-md-3 imgData image_url"
              alt="${data.tite}"
            />
            <div class="card-body text-start">
              <div class="cart-summary">
                <small class="text-secondary category" id="featuredCategory">${data.category}</small>
                <p class="card-text text-dark title" id="featuredTitle">${data.title}</p>
                <p class="card-text text-secondary rating">
                <span class="star-rating "
                style="
                background-image: linear-gradient(to right,gold 0%,gold ${data.rating}%,transparent ${data.rating}%,transparent 100%);"
                >
                </span>
                ${parseFloat(data.star_rating).toFixed(1)}
              </p>
              </div>
              
              <div class="d-flex justify-content-between align-items-center py-2">
                <small id="featuredPrice" class="price">₱${data.price}</small>
                <a
                  id="addcartBtn"
                  class="btn btn-success btn-sm d-flex align-items-center addCart"
                  data-bs-toggle="modal"
                  data-bs-target="#addcartBody"

                >
                + Add  
                </a
                >
              </div>
            </div>
          </div>
        </a>
      </div>
  `;

  featuredProd.innerHTML = featuredOutput;
};

// addcart function
let itemId;
let productId;
featuredProd.addEventListener("click", (e) => {
  let cartBtn = e.target.id == "addcartBtn";
  itemId = e.target.parentElement.parentElement.parentElement.parentElement.id;

  if (cartBtn) {
    fetch(`/products-to-cart?products=${itemId}`)
      .then((res) => res.json())
      .then((res) => {
        // addCartData(res["results"]);
        let productArr = [];

        let imageArr = res["results"].image_url.title;
        for (let i = 0; i < imageArr.length; i++) {
          let featureCartOutput = `

          <button id="${i}" class="cartFlavour m-3 text-success p-2 flavCart" type="button">
                <div class="d-flex flex-column">
                  <img src="static/img/${imageArr[i][1]}" height="100" alt="">
                  <small class="my-2">${imageArr[i][0]}</small>
                </div>
          </button>

      `;
          productArr.push(featureCartOutput);
        }
        
        addCartData(productArr);
      });
  }
});

// cart modal products
let cartToPost = document.querySelector(".cartToPost");
const addCartData = (data) => {
  let allProductOutput = "";
  data.forEach((item) => {
    allProductOutput += item;
  });
  cartToPost.innerHTML = allProductOutput;

  let flavours = document.querySelectorAll(".flavCart");
  flavours[0].classList.add("cartActive")
  productId = flavours[0].id
  flavours.forEach((item) => {
    item.addEventListener("click", () => {
      flavours[0].classList.remove("cartActive")
      item.classList.add("cartActive")
      item.classList.remove("cartActive")
      productId = item.id;
    });
  });
};
// end of addcart function

// function for show image in add products files
let image1 = document.querySelector("#file1");
let image2 = document.querySelector("#file2");
let image3 = document.querySelector("#file3");
let image4 = document.querySelector("#file4");

let label1 = document.querySelector("#file1Image");
let label2 = document.querySelector("#file2Image");
let label3 = document.querySelector("#file3Image");
let label4 = document.querySelector("#file4Image");

let listImageBinary = []
const addImage = (inputId, labelId) => {
  inputId.addEventListener("change", () => {
    let file = inputId.files[0];
    let newFile = new FileReader();
    newFile.onload = () => {
      labelId.style.backgroundImage = `url(${newFile.result})`;
      listImageBinary.push(newFile.result)
    };
    if (file) {
      newFile.readAsDataURL(file);
    }
  });


};



// forms
const formData = () => {
  let title = document.querySelector("#title");
  let quantity = document.querySelector("#quantity");
  let price = document.querySelector("#price");
  let category = document.querySelector("#category");
  let filetitle1 = document.querySelector("#flavour1");
  let filetitle2 = document.querySelector("#flavour2");
  let filetitle3 = document.querySelector("#flavour3");
  let filetitle4 = document.querySelector("#flavour4");
  let image1 = document.querySelector("#file1");
  let image2 = document.querySelector("#file2");
  let image3 = document.querySelector("#file3");
  let image4 = document.querySelector("#file4");
  let newForm = new FormData();
  newForm.append("title", title.value);
  newForm.append("quantity", quantity.value);
  newForm.append("price", price.value);
  newForm.append("category", category.value);
  newForm.append("filtitle", filetitle1.value);
  newForm.append("filtitle", filetitle2.value);
  newForm.append("filtitle", filetitle3.value);
  newForm.append("filtitle", filetitle4.value);
  newForm.append("file", image1.files[0]);
  newForm.append("file", image2.files[0]);
  newForm.append("file", image3.files[0]);
  newForm.append("file", image4.files[0]);
  listImageBinary.forEach(imageBinary => {
    newForm.append("image_binary", imageBinary);
  })
  
  
  return newForm;
};
