let relatedProductId;
document
  .querySelector("#preview_carousel_product")
  .addEventListener("click", (e) => {
    relatedProductId = e.target.id;
    fetch(`/products-to-cart?products=${relatedProductId}`)
      .then((res) => res.json())
      .then((res) => {
        // addCartData(res["results"]);
        let productArr = [];

        let imageArr = res["results"].image_url.title;
        for (let i = 0; i < imageArr.length; i++) {
          let featureCartOutput = `

          <button id="${i}" class="cartFlavour m-3 text-success p-2 flavCart carousel-flavour" type="button">
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
  });

// addcart data to the DB
document.querySelector("#prevChooseCart").addEventListener("click", () => {
  fetch(`/add-cart?q=${relatedProductId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flavour: productId }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res["is_authenticated"] === false) {
        location.replace("/login");
      } else {
        if (res["message"] == "No settings") {
          location.replace("/user_address");
        } else {
          document.querySelector("#addcart-alert").innerHTML = res["message"];
          $(document).ready(function () {
            $("#addcart-alert")
              .fadeTo(2000, 500)
              .slideUp(500, function () {
                $("#addcart-alert").slideUp(500);
              });
          });
        }
        cartHtmlData(res["results"]);
        addcartLen.innerHTML = res["len"];
        if (res["len"] !== "") {
          cartBtn.innerHTML = `
          <input name="addcart_btn" type="button" value="Check Out" href="#" class="btn btn-success px-3 w-25 d-flex align-items-center justify-content-center self-align-end"/>
          `;
        }
      }
    });
});

// cart modal products
let cartToPost = document.querySelector(".prevCartToPost");
const addCartData = (data) => {
  let allProductOutput = "";

  data.forEach((item) => {
    allProductOutput += item;
  });
  cartToPost.innerHTML = allProductOutput;

  let flavours = document.querySelectorAll(".carousel-flavour");
  flavours[0].classList.add("cartActive");
  productId = flavours[0].id;
  flavours.forEach((item) => {
    item.addEventListener("click", () => {
      flavours[0].classList.remove("cartActive");
      item.classList.add("cartActive");
      item.classList.remove("cartActive");
      productId = item.id;
    });
  });
};
// end of addcart function
