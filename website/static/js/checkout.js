document.querySelector("#checkoutButtons").addEventListener("click", (e) => {
  let id = e.target.id;
  if (e.target.classList.contains("buy_item")) {
    let imagePos = document.querySelector(".image_pos").id;
    let imageFilename = document.querySelector(".image_filename").id;
    fetch(`/proceed-checkout?id=${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imagePos: imagePos,
        imageFilename: imageFilename,
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res["message"]));
  } else if (e.target.classList.contains("multipleProduct")) {
    let listId = [];
    eval(id).forEach((productId) => {
      listId.push(productId);
    });

    fetch(`/proceed-checkout?checkoutId=${listId}`)
      .then((res) => res.json())
      .then((res) => console.log(res["message"]));
  } else {
    fetch(`/proceed-checkout?singleCart=${e.target.id}`)
      .then((res) => res.json())
      .then((res) => console.log(res["message"]));
  }
});
