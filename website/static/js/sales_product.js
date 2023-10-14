let salesProductParent = document.querySelector("#salesProduct")
let salesCard = document.querySelector("#salesCard")
let currentPage = 1
let row = 5
const fetchSales = () => {
    fetch("/dashboard-sales-product").then(res => res.json())
    .then(res => {
        let salesItems = res["results"]

        paginationDisplay(salesItems, salesProductParent, row, currentPage)
        setupPagination(salesItems, salesCard, row)
    })
}

fetchSales()

const paginationDisplay = (items, wrapper, rows_per_page, current_page) => {
    wrapper.innerHTML = ""
    current_page--

    let loopStart = rows_per_page * current_page;
    let loopEnd = loopStart + rows_per_page;
    let paginatedItems = items.slice(loopStart, loopEnd)

    for(let i = 0; i < paginatedItems.length; i++){
        
        let row = document.createElement("tr");
        
        row.innerHTML = `
            <td>${paginatedItems[i].id}</td>
            <td>${paginatedItems[i].title}</td>
            <td>${paginatedItems[i].category}</td>
            <td>₱${paginatedItems[i].price}</td>
            <td class="text-secondary">${paginatedItems[i].buyer_quantity}x</td>
            <td>₱${paginatedItems[i].total_price}</td>
            <td>
                <img
                src="static/img/${paginatedItems[i].image_url}"
                class="card-img-top p-lg-4 p-md-3 imgData salesImage"
                alt="${paginatedItems[i].title}"
                />
            </td>
        `

        wrapper.appendChild(row)
    }

}

const setupPagination = (items, wrapper, rows_per_page) => {

    let page_count = Math.ceil(items.length / rows_per_page);

    let btn = paginationButton(page_count, items)
    wrapper.appendChild(btn)

}


let button = document.createElement("nav");
button.id = "paginationButton"
button.classList  = "py-5"
let nextPage = 1;
const paginationButton = (page, items) => {
    
    button.innerHTML = `
            <ul class="pagination">
                <li class="page-item">
                    <a class="page-link prev" aria-label="Previous">
                        &laquo;
                    </a>
                </li>
                <li class="page-item"><a class="page-link pageChange disabled" href="#">${currentPage}</a></li>
                <li class="page-item">
                    <a class="page-link next" aria-label="Next">
                        &raquo;
                    </a>
                </li>
            </ul>
    `

    if(currentPage == page) button.classList.add("active");

    button.addEventListener("click", (e) => {
        let next = e.target.classList.contains("next")
        let prev = e.target.classList.contains("prev")
        let pageChange = document.querySelector(".pageChange")

        if (next){
            nextPage += 1
            if(nextPage >= page){
                nextPage = page
            }
            currentPage = nextPage 
            pageChange.innerHTML = currentPage
        }
        if (prev){
            nextPage -= 1
            if (nextPage <= 1){
                nextPage = 1
            }
            currentPage = nextPage
            pageChange.innerHTML = currentPage
        }
        // if(prev) currentPage -= page
        // if(currentPage < 1) currentPage = 1
        paginationDisplay(items, salesProductParent, row, currentPage)
    })

    return button
}



// add product

document.querySelector("#addProductForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let addData = formData();
    fetch("/add-product", {
      method: "POST",
      body: addData,
    })
    
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
  listImageBinary.forEach(imageBinary => {
    newForm.append("image_binary", imageBinary);
  })
  
  
  return newForm;
};