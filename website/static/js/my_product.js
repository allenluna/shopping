window.onload = () => {
  addImageFile(file1, newFileImage1);
  addImageFile(file2, newFileImage2);
  addImageFile(file3, newFileImage3);
  addImageFile(file4, newFileImage4);
  fetchData();
};

let productItems = document.querySelector("#productItems");
let containerPage = document.querySelector("#containerPage");
let currentPage = 1;
let rows = 8;
const fetchData = () => {
  fetch("/added_product")
    .then((res) => res.json())
    .then((res) => {
      let productArr = res["results"];
      paginationDisplay(productArr, productItems, rows, currentPage);
      setupPagination(productArr, containerPage);
    });
};

// pagination function
let paginatedItems;
const paginationDisplay = (items, wrapper, rows_per_page, current_page) => {
  wrapper.innerHTML = "";
  current_page--;

  let loopStart = rows_per_page * current_page;
  let loopEnd = loopStart + rows_per_page;
  paginatedItems = items.slice(loopStart, loopEnd);
  let myProduct = "";
  for (let i = 0; i < paginatedItems.length; i++) {
    myProduct += `
  
        <div id="${paginatedItems[i].id}" class="">
        <a class="nav-link linkData">
            <div class="card">
                    <img
                    src="static/img/${paginatedItems[i].image_url.title[0][1]}"
                    class="card-img-top p-lg-4 p-md-3 imgData image_url"
                    alt="${paginatedItems[i].title}"
                    height="200"
                    />
                    <div class="card-body text-start">
                    <div class="cart-summary">
                        <small class="text-secondary category" id="featuredCategory">${
                          paginatedItems[i].category
                        }</small>
                        <p class="card-text text-dark title" id="featuredTitle">${
                          paginatedItems[i].title
                        }</p>
                        <p class="card-text text-secondary rating">
                        <span class="star-rating"
                        style="
                        background-image: linear-gradient(to right,gold 0%,gold ${
                          paginatedItems[i].rating
                        }%,transparent ${
      paginatedItems[i].rating
    }%,transparent 100%);"
                        >
                        </span>
                        ${parseFloat(paginatedItems[i].star_rating).toFixed(1)}
                    </p>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center py-2 editMyProduct">
                        <small id="featuredPrice">₱${
                          paginatedItems[i].price
                        }</small>
                        <div class="editProductIcon">
                            <a href="/preview?q=${
                              paginatedItems[i].id
                            }" class="text-secondary visit-product"><i class="bi bi-eye myView"></i></a>
                            <i class="bi bi-pencil-square myProdEdit" id="${
                              paginatedItems[i].id
                            }"
                            data-bs-toggle="modal"
                            data-bs-target="#myProduct"></i>
                            <i class="bi bi-trash3 myProdDelete" id="${
                              paginatedItems[i].id
                            }"
                            data-bs-toggle="modal"
                            data-bs-target="#delelteProductData"
                            ></i>
                        </div>
                        
                    </div>
                    </div>
                </div>
                </a>
            </div>
        `;
    wrapper.innerHTML = myProduct;
  }
};

const setupPagination = (items, wrapper) => {
  let page_count = Math.ceil(items.length / rows);
  for (let i = 1; i < page_count + 1; i++) {
    let btn = paginationButton(i, items);
    wrapper.appendChild(btn);
  }
};

let button = document.createElement("nav");
button.id = "paginationButton";
button.classList = "py-5";
const paginationButton = (page, items) => {
  button.innerHTML = `
            <ul class="pagination">
                <li class="page-item">
                    <button class="page-link prev" aria-label="Previous">
                        &laquo;
                    </button>
                </li>
                <li class="page-item"><a class="page-link pageChange disabled" href="#">${currentPage}</a></li>
                <li class="page-item">
                    <button class="page-link next" aria-label="Next">
                        &raquo;
                    </button>
                </li>
            </ul>
    `;

  if (currentPage == page) button.classList.add("active");

  button.addEventListener("click", (e) => {
    let next = e.target.classList.contains("next");
    let prev = e.target.classList.contains("prev");
    let pageChange = document.querySelector(".pageChange");

    if (next) currentPage = page;
    if (prev) currentPage -= page;
    if (currentPage < 1) currentPage = 1;
    pageChange.innerHTML = currentPage;
    paginationDisplay(items, productItems, rows, currentPage);
  });

  return button;
};

// end of pagination function

// edit and delete function
let productParent;
let deleteProduct;
let editProductId;
let editImage;
let editCategory;
let editTitle;
let editPrice;
productItems.addEventListener("click", (e) => {
  let productTarget = e.target.classList.contains("myProdDelete");
  let editTarget = e.target.classList.contains("myProdEdit");
  if (productTarget) {
    productParent =
      e.target.parentElement.parentElement.parentElement.parentElement
        .parentElement;
    deleteProduct = e.target.id;
  }

  if (editTarget) {
    editProductId = e.target.id;
    editImage =
      e.target.parentElement.parentElement.parentElement.parentElement
        .children[0].children[0];
    editCategory =
      e.target.parentElement.parentElement.parentElement.children[0].children[0]
        .children[0];
    editTitle =
      e.target.parentElement.parentElement.parentElement.children[0].children[0]
        .children[1];
    editPrice = e.target.parentElement.parentElement.children[0];
    e.preventDefault();
    fetch(`/edit-product?q=${editProductId}`)
      .then((res) => res.json())
      .then((res) => {
        let title = document.querySelector("#editTitle");
        let quantity = document.querySelector("#editQuantity");
        let price = document.querySelector("#editPrice");
        let category = document.querySelector("#editCategory");

        title.value = res["results"].title;
        quantity.value = res["results"].quantity;
        price.value = res["results"].price;
        category.value = res["results"].category;

        document
          .querySelector("#editProductBtn")
          .addEventListener("click", (e) => {
            e.preventDefault();
            let editForm = EditformData();
            fetch(`/toedit-product?q=${editProductId}`, {
              method: "POST",
              body: editForm,
            })
              .then((res) => res.json())
              .then((res) => {
                let fileImage1 = document.querySelector("#file1Image1");
                let fileImage2 = document.querySelector("#file2Image2");
                let fileImage3 = document.querySelector("#file3Image3");
                let fileImage4 = document.querySelector("#file4Image4");

                editImage.src = `static/img/${res["results"].image_url.title[0][1]}`;
                editCategory.innerHTML = res["results"].category;
                editTitle.innerHTML = res["results"].title;
                editPrice.innerHTML = `₱${res["results"].price}`;
                document.querySelector("#addMyProduct").reset();
                fileImage1.style.backgroundImage = `url(static/assets/addImage.png)`;
                fileImage2.style.backgroundImage = `url(static/assets/addImage.png)`;
                fileImage3.style.backgroundImage = `url(static/assets/addImage.png)`;
                fileImage4.style.backgroundImage = `url(static/assets/addImage.png)`;
              });
          });
      });
  }
});

document.querySelector("#deleteProduct").addEventListener("click", () => {
  fetch(`/delete-product?delete=${deleteProduct}`)
    .then((res) => res.json())
    .then(() => {
      location.reload();
    });
});

let newFileImage1 = document.querySelector(".file1Image1");
let newFileImage2 = document.querySelector(".file2Image2");
let newFileImage3 = document.querySelector(".file3Image3");
let newFileImage4 = document.querySelector(".file4Image4");

let file1 = document.querySelector("#editFile1");
let file2 = document.querySelector("#editFile2");
let file3 = document.querySelector("#editFile3");
let file4 = document.querySelector("#editFile4");

let editListImageBinary = [];
const addImageFile = (inputId, labelId) => {
  inputId.addEventListener("change", () => {
    let file = inputId.files[0];
    let newFile = new FileReader();
    newFile.onload = () => {
      labelId.style.backgroundImage = `url(${newFile.result})`;
      editListImageBinary.push(newFile.result);
    };
    if (file) {
      newFile.readAsDataURL(file);
    }
  });
};

const EditformData = () => {
  let title = document.querySelector("#editTitle");
  let quantity = document.querySelector("#editQuantity");
  let price = document.querySelector("#editPrice");
  let category = document.querySelector("#editCategory");
  let filetitle1 = document.querySelector("#editFlavour1");
  let filetitle2 = document.querySelector("#editFlavour2");
  let filetitle3 = document.querySelector("#editFlavour3");
  let filetitle4 = document.querySelector("#editFlavour4");
  let image1 = document.querySelector("#editFile1");
  let image2 = document.querySelector("#editFile2");
  let image3 = document.querySelector("#editFile3");
  let image4 = document.querySelector("#editFile4");
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
  editListImageBinary.forEach((imageBinary) => {
    newForm.append("image_binary", imageBinary);
  });
  return newForm;
};
