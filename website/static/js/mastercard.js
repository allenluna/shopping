document.querySelector("#paymentSubmit").addEventListener("click", (e) => {
  e.preventDefault();
  let mastercardData = mastercardFormData();
  let mastercardEntry = [...mastercardData.entries()];

  // items id
  let addcart_list_id;
  let product_item;
  let addcart_item;
  if (e.target.classList.contains("addcart_item")) {
    addcart_item = document.querySelector(".addcartItemId").id;
  }
  if (e.target.classList.contains("product_item")) {
    product_item = document.querySelector(".productItemId").id;
  }
  if (e.target.classList.contains("addcart_list_id")) {
    addcart_list_id = document.querySelector(".addcartListId").id;
  }

  // check if field is empty.
  if (
    mastercardEntry[0][1] == "" ||
    mastercardEntry[1][1] == "" ||
    mastercardEntry[2][1] == "" ||
    mastercardEntry[3][1] == ""
  ) {
    document.querySelector("#modalPaymentFooter").innerHTML = `
             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
              </button>
              <button
                type="button"
                class="btn btn-success"
                  id="fieldEmpty"
              >
                Checkout
             </button>
             `;
    document.querySelector("#fieldEmpty").addEventListener("click", () => {
      //field if empty.
          $("#checkout-alert")
            .fadeTo(2000, 500)
            .slideUp(500, function () {
              $("#checkout-alert").slideUp(500);
            });
    });
  } else {
    document.querySelector("#modalPaymentFooter").innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Close
            </button>
            <button
              type="button"
              class="btn btn-success"
              id="toCheckOut"
              data-bs-toggle="modal"
              data-bs-target="#checkoutPayment"
            >
              Checkout
            </button>
            `;

    // checkoutitem
    document.querySelector("#toCheckOut").addEventListener("click", () => {
      if (addcart_item) {
        fetch(`/proceed-checkout?singleCart=${addcart_item}`)
          .then((res) => res.json())
          .then((res) => console.log(res["message"]));
      } else if (product_item) {
        const imagePos = document.querySelector(".productItemimagePos").id;
        const imgFilename = document.querySelector(".productItemFilename").id;
        fetch(`/proceed-checkout?id=${product_item}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imagePos: imagePos,
            imageFilename: imgFilename,
          }),
        })
          .then((res) => res.json())
          .then((res) => console.log(res["message"]));
      } else {
        // for multiple product
        fetch(`/proceed-checkout?checkoutId=${addcart_list_id}`)
          .then((res) => res.json())
          .then((res) => console.log(res["message"]));
      }
    });
  }


});

// forms
const mastercardFormData = () => {
  let cardNumber = document.querySelector("#cardNumber");
  let CardHolderName = document.querySelector("#cardName");
  let cardExpDate = document.querySelector("#expDate");
  let cardCvv = document.querySelector("#cvv");

  let newForm = new FormData();
  newForm.append("cardNumber", cardNumber.value);
  newForm.append("CardHolderName", CardHolderName.value);
  newForm.append("cardExpDate", cardExpDate.value);
  newForm.append("cardCvv", cardCvv.value);
  return newForm;
};
