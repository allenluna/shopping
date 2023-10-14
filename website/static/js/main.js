// const productBtn = document.querySelector("#productBtn");

// productBtn.addEventListener("click", e => {
//     e.preventDefault()

//     const title = document.querySelector("#title");
//     const quantity = document.querySelector("#quantity");
//     const price = document.querySelector("#price");
//     const category = document.querySelector("#category");
//     const file1 = document.querySelector("#file1");
//     const file2 = document.querySelector("#file2");
//     const file3 = document.querySelector("#file3");
//     const file4 = document.querySelector("#file4");

//     const form = document.querySelector("#form-data");
//     const formData = new FormData(form);
//     formData.append("title", title.value);
//     formData.append("price", price.value);
//     formData.append("quantity", quantity.value);
//     formData.append("category", category.value);
//     formData.append("file1", file1.files[0]);
//     formData.append("file2", file2.files[0]);
//     formData.append("file3", file3.files[0]);
//     formData.append("file3", file4.files[0]);

//     fetch("/post-brand", {
//         method : "POST",
//         body : formData
//     }).then(res => res.json()).then(res => {
//         if(res["message"] === "Success"){
//             let alertSuccess = `
//             <div id="product-success" class="alert alert-success alert-dismissible fade show" role="alert">
//                 <strong>Success!</strong> Product added to the database.
//                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//             </div>
            
//             `

//             form.insertAdjacentHTML("beforebegin", alertSuccess);
//             window.setTimeout(() => {
//                 $("#product-success").fadeTo(500, 0).slideUp(500, () => {
//                     $(this).remove();
//                 });
//             }, 1000)
//         }else{

//             let alertError = `
//             <div id="product-error" class="alert alert-danger alert-dismissible fade show" role="alert">
//                 ${res["message"]}
//                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//             </div>
            
//             `

//             form.insertAdjacentHTML("beforebegin", alertError);
//             window.setTimeout(() => {
//                 $("#product-error").fadeTo(500, 0).slideUp(500, () => {
//                     $(this).remove();
//                 });
//             }, 1000)

//         }
//     });


    
    

// });