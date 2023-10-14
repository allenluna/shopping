let decrement = document.querySelector(".quantityDec");
let increment = document.querySelector(".quantityInc");

increment.addEventListener("click", (e) => {
  let incrementTarget = e.target;
  let inputTarget = incrementTarget.parentElement.children[2];
  let incrementValue = parseInt(inputTarget.value) + 1;
  inputTarget.value = incrementValue;
});

decrement.addEventListener("click", (e) => {
  let deccrementTarget = e.target;
  let inputTarget = deccrementTarget.parentElement.children[2];
  let deccrementValue = parseInt(inputTarget.value) - 1;

  if (deccrementValue < 1) {
    deccrementValue = 1;
  }

  inputTarget.value = deccrementValue;
});
