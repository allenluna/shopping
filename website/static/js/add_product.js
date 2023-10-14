window.onload = () => {
  addImage(image1, label1);
  addImage(image2, label2);
  addImage(image3, label3);
  addImage(image4, label4);
};

// add product
document.querySelector("#addProductForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let addData = addProductData();
  fetch("/add-product", {
    method: "POST",
    body: addData,
  })
    .then((res) => res.json())
    .then((res) => {});

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

// forms
const addProductData = () => {
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
