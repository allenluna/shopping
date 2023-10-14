// add product

document.querySelector("#addProductForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let addData = formData();
  fetch("/add-product", {
    method: "POST",
    body: addData,
  })
    .then((res) => res.json())
    .then(() => {
      fetch("/added_product")
        .then((res) => res.json())
        .then((response) => {
          let productArr = response["results"];

          location.reload();
          paginationDisplay(productArr, productItems, rows, currentPage);
          setupPagination(productArr, containerPage, rows);
        });
    });

  // alert
  window.setTimeout(() => {
    $("#success-alert")
      .fadeTo(2000, 500)
      .slideUp(500, function () {
        $("#success-alert").slideUp(500);
      });
  });

  document.querySelector("#addProductForm").reset();
  label1.style.backgroundImage = `url(static/assets/addImage.png)`;
  label2.style.backgroundImage = `url(static/assets/addImage.png)`;
  label3.style.backgroundImage = `url(static/assets/addImage.png)`;
  label4.style.backgroundImage = `url(static/assets/addImage.png)`;
});

const productItem = (data, wrapper) => {
  let myData = document.createElement("div");
  myData.classList = "featuredData";
  myData.id = data.id;
  myData.innerHTML = `
        
        <a class="nav-link linkData">
            <div class="card hover-success">
                    <img
                    src="static/img/${data.image_url.title[0][1]}"
                    class="card-img-top p-lg-4 p-md-3 imgData"
                    alt="${data.title}"
                    height="200"
                    />
                    <div class="card-body text-start">
                    <div class="cart-summary">
                        <small class="text-secondary" id="featuredCategory">${
                          data.category
                        }</small>
                        <p class="card-text text-dark" id="featuredTitle">${
                          data.title
                        }</p>
                        <p class="card-text text-secondary">
                        <span class="star-rating"
                        style="
                        background-image: linear-gradient(to right,gold 0%,gold ${
                          data.rating
                        }%,transparent ${data.rating}%,transparent 100%);"
                        >
                        </span>
                        ${parseFloat(data.star_rating).toFixed(1)}
                    </p>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center py-2">
                        <small id="featuredPrice">₱${data.price}</small>
                        <div>
                            <i class="bi bi-pencil-square myProdEdit" id="${
                              data.id
                            }"
                            data-bs-toggle="modal"
                            data-bs-target="#myProduct"></i>
                            <i class="bi bi-trash3 myProdDelete" id="${
                              data.id
                            }"></i>
                        </div>
                        
                    </div>
                    </div>
                </div>
                </a>
        `;
  wrapper.appendChild(myData);
};

// function for show image in add products files
let image1 = document.querySelector("#file1");
let image2 = document.querySelector("#file2");
let image3 = document.querySelector("#file3");
let image4 = document.querySelector("#file4");

let label1 = document.querySelector("#file1Image");
let label2 = document.querySelector("#file2Image");
let label3 = document.querySelector("#file3Image");
let label4 = document.querySelector("#file4Image");

let listImageBinary = [];
const addImage = (inputId, labelId) => {
  inputId.addEventListener("change", () => {
    let file = inputId.files[0];
    let newFile = new FileReader();
    newFile.onload = () => {
      labelId.style.backgroundImage = `url(${newFile.result})`;
      listImageBinary.push(newFile.result);
    };
    if (file) {
      newFile.readAsDataURL(file);
    }
  });
};

addImage(image1, label1);
addImage(image2, label2);
addImage(image3, label3);
addImage(image4, label4);

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
  listImageBinary.forEach((imageBinary) => {
    newForm.append("image_binary", imageBinary);
  });

  return newForm;
};

// addcart data
// addcart data
let addcartItem = document.querySelector("#addCartDataToPost");
let addcartLen = document.querySelector("#addcartLen");
let cartBtn = document.querySelector("#addCartBtn");
const addcartData = () => {
  fetch("/addcart-data")
    .then((res) => res.json())
    .then((res) => {
      if (res["len"] !== "") {
        cartBtn.innerHTML = `
        <input id="addcart_btn" name="addcart_btn" type="button" value="Check Out" href="#" class="btn btn-success px-3 w-25 d-flex align-items-center justify-content-center self-align-end"/>
        `;
      }
      addcartLen.innerHTML = res["len"];

      let productArr = res["results"];
      let listProduct = [];
      productArr.map((item) => {
        listProduct.push(item);
      });

      listProduct.forEach((item) => {
        cartHtmlData(item);
      });
    })
    .then(() => {
      document.querySelector("#addCartBtn").addEventListener("click", (e) => {
        let checkItem = document.querySelectorAll(".checkItem");
        let quantityVal = document.querySelectorAll("#cartAddQuantity");
        let listId = [];
        let quantityValList = [];
        let singleProd;
        let singleQuantity;
        for (let i = 0; i < checkItem.length; i++) {
          if (checkItem[i].checked == true) {
            listId.push(checkItem[i].id);
            singleProd = checkItem[i].id;
            singleQuantity = quantityVal[i].value;
            quantityValList.push(quantityVal[i].value);
          }
        }

        if (quantityValList.length !== 1) {
          // multiple cart to proceed
          fetch(`/list-cart?addcart=${listId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartQuantity: quantityValList }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res["message"] == "No settings") {
                location.replace("/user_address");
              } else if (res["message"] == "Out of stocks") {
                document.querySelector("#mastercard-alert").innerHTML =
                  res["quantity"];
                $(document).ready(function () {
                  $("#mastercard-alert")
                    .fadeTo(2000, 500)
                    .slideUp(500, function () {
                      $("#mastercard-alert").slideUp(500);
                    });
                });
              } else if (
                res["message"] ==
                "Your order quantity is greater than the item quantity"
              ) {
                document.querySelector("#mastercard-alert").innerHTML =
                  res["quantity"];
                $(document).ready(function () {
                  $("#mastercard-alert")
                    .fadeTo(2000, 500)
                    .slideUp(500, function () {
                      $("#mastercard-alert").slideUp(500);
                    });
                });
              } else {
                location.replace(`/payment-cart?addcart=${listId}`);
              }
            });
        } else {
          fetch(`/single-cart?id=${singleProd}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ singleCart: singleQuantity }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res["message"] == "No settings") {
                location.replace("/user_address");
              } else if (res["message"] == "Success") {
                location.replace(`/single-payment-cart?id=${singleProd}`);
              } else if (
                res["message"] ==
                "Your order quantity is greater than the item quantity"
              ) {
                document.querySelector("#mastercard-alert").innerHTML =
                  res["message"] +
                  " the actual quantity are only " +
                  res["quantity"] +
                  "pcs.";
                $(document).ready(function () {
                  $("#mastercard-alert")
                    .fadeTo(2000, 500)
                    .slideUp(500, function () {
                      $("#mastercard-alert").slideUp(500);
                    });
                });
              } else {
                document.querySelector("#mastercard-alert").innerHTML =
                  res["message"];
                $(document).ready(function () {
                  $("#mastercard-alert")
                    .fadeTo(2000, 500)
                    .slideUp(500, function () {
                      $("#mastercard-alert").slideUp(500);
                    });
                });
              }
            });
        }
      });
    });
};
addcartData();
// append data to html

const cartHtmlData = (item) => {
  let row = document.createElement("div");
  row.classList.add("row");
  row.id = row;
  row.innerHTML = `
    
    <div class="row addcartRow" id="${item.id}">
      <div class="col-1" id="checkboxData">
          <div class="form-check cart-check-box">
            <input value="checked" class="form-check-input checkbox_l checkItem" type="checkbox" id="${item.id}" onClick="">
          </div>
      </div>
      <div class="col-2">
        <div class="py-2">
          <img src="../static/img/${item.image_url[1]}" class="addcart_image" height="100" width="100" alt="">
        </div>
      </div>
      <div class="col-5 addcart-summary-head">
        <div class="addcart-summary-title">
          <small class="text-success">
            ${item.category}
          </small>
          <p class="cart-title py-0 addcart-title">${item.title} <span class="text-success addcart-title">${item.image_url[0]}</span></p>
          <a id="${item.id}" class="text-secondary cart-delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
            </svg>
          </a>
        </div>
      </div>
      <div class="col-3 cart-quantity-summary">
        
        <div class="cart-quantity">
          <a type="button" class="dec">-</a>
          <input
            type="text"
            id="cartAddQuantity"
            readonly="readonly"
            pattern="\d*"
            class="text-center"
            value="1 "
          />
          <a type="button" class="inc">+</a>
        </div>
      </div>
      <div class="col-1 price-summary">
        <small class="cart-price text-success">₱${item.price}</small>
      </div>
  
      <hr class="my-2">
      </div>
  
    
    `;
  addcartItem.appendChild(row);
};

// delete adcart item
addcartItem.addEventListener("click", (e) => {
  // delete addcart function
  let itemDelete = e.target.parentElement.classList.contains("cart-delete");
  if (itemDelete) {
    let deleteItemId = e.target.parentElement.id;
    fetch(`/delete-cart?delete=${deleteItemId}`)
      .then((res) => res.json())
      .then((res) => {
        document.querySelector("#mastercard-alert").innerHTML = res["message"];
        $(document).ready(function () {
          $("#mastercard-alert")
            .fadeTo(2000, 500)
            .slideUp(500, function () {
              $("#mastercard-alert").slideUp(500);
            });
        });
        let deleteElement =
          e.target.parentElement.parentElement.parentElement.parentElement;
        let deleteParent =
          e.target.parentElement.parentElement.parentElement.parentElement
            .parentElement;
        addcartLen.innerHTML -= 1;
        if (addcartLen.innerHTML == 0) {
          addcartLen.innerHTML = "";
        }
        deleteParent.removeChild(deleteElement);

        if (res["len"] == "") {
          cartBtn.innerHTML = "";
        }
      });
  }

  // quantity function
  let inc = e.target.classList.contains("inc");
  let dec = e.target.classList.contains("dec");
  if (inc) {
    let input = e.target.parentElement.children[1];
    let increase = parseInt(input.value) + 1;
    input.value = increase;
  }

  if (dec) {
    let input = e.target.parentElement.children[1];
    let decrease = parseInt(input.value) - 1;
    if (decrease < 1) {
      decrease = 1;
    }
    input.value = decrease;
  }
});
