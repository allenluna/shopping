// addcart data
let cartBtn = document.querySelector("#addCartBtn");
let addcartItem = document.querySelector("#addCartDataToPost");
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
        let quantityVal = document.querySelectorAll("#quantity");
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
              if (res["message"] == "Out of stocks") {
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
              } else if (res["message"] == "No settings") {
                location.replace("/user_address");
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
              if (res["message"] == "Success") {
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

const cartHtmlData = (item) => {
  let row = document.createElement("div");
  row.classList.add("row");
  row.id = row;
  row.innerHTML = `
    
  <div class="row addcartRow" id="${item.id}">
  <div class="col-1" id="checkboxData">
      <div class="form-check cart-check-box">
        <input value="checked" class="form-check-input checkbox_l checkItem" type="checkbox" id="${item.id}">
      </div>
  </div>
  <div class="col-2">
    <div class="py-2">
      <img src="../static/img/${item.image_url[1]}" class="addcart_image" alt="${item.title}">
    </div>
  </div>
  <div class="col-5 addcart-summary-head">
  <div class="addcart-summary-title">
    <small class="text-success cart-category">
      ${item.category}
    </small>
    <p class="cart-title py-0 addcart-title">${item.title} <span class="text-success  addcart-title">${item.image_url[0]}</span></p>
    <a id="${item.id}" class="text-secondary cart-delete">
      <svg id="${item.id}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
        <path id="${item.id}" d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
      </svg>
    </a>
  </div>
</div>
  <div class="col-3 cart-quantity-summary">
    
    <div class="cart-quantity">
      <a type="button" class="dec">-</a>
      <input
        type="text"
        id="quantity"
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
        alert(res["message"]);
        let deleteElement =
          e.target.parentElement.parentElement.parentElement.parentElement;
        let deleteParent =
          e.target.parentElement.parentElement.parentElement.parentElement
            .parentElement;
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
