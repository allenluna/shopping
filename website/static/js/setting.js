window.addEventListener("load" , () => {
    fetchUserAddress()
    
})

const insertData = document.querySelector("#userDiv");
document.querySelector("#addressForm").addEventListener("submit", (e) => {
    e.preventDefault()
    
    data = {
        "name" : document.querySelector("#name").value,
        "contact" : document.querySelector("#contact").value,
        "email" : document.querySelector("#email").value,
        "address" : document.querySelector("#address").value,
        "city" : document.querySelector("#city").value,
        "zipcode" : document.querySelector("#zipcode").value
    }

    fetch("/add-address", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        if(res["results"].users === 1){
            const addAddress = document.querySelector("#addAddress")
            const updateAddress = document.querySelector("#updateAddressData")
            const deleteAddress = document.querySelector("#deleteDataAddress")

            addAddress.classList.add("add-address")
            updateAddress.classList.remove("update-none")
            deleteAddress.classList.remove("update-none")
        }

        htmlData(res["results"].results)
    });


    document.querySelector("#name").value = ""
    document.querySelector("#contact").value = ""
    document.querySelector("#email").value = ""
    document.querySelector("#address").value = ""
    document.querySelector("#city").value = ""
    document.querySelector("#zipcode").value = ""

});


document.querySelector("#updateForm").addEventListener("submit", (e) => {
    e.preventDefault()
    data = {
        "name" : document.querySelector("#uname").value,
        "contact" : document.querySelector("#ucontact").value,
        "email" : document.querySelector("#uemail").value,
        "address" : document.querySelector("#uaddress").value,
        "city" : document.querySelector("#ucity").value,
        "zipcode" : document.querySelector("#uzipcode").value
    }
    fetch("/update-address", {
        method : "PATCH",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify(data)
    })

    .then(res => res.json())
    .then(res => {
        htmlData(res["results"].results)
    });

    document.querySelector("#uname").value = ""
    document.querySelector("#ucontact").value = ""
    document.querySelector("#uemail").value = ""
    document.querySelector("#uaddress").value = ""
    document.querySelector("#ucity").value = ""
    document.querySelector("#uzipcode").value = ""

});

fetchUserAddress = () => {

    fetch("/read-setting")
    .then(res => res.json())
    .then(res => {

        if(res["results"].users === 1){
            const addAddress = document.querySelector("#addAddress")
            const updateAddress = document.querySelector("#updateAddressData")
            const deleteAddress = document.querySelector("#deleteDataAddress")

            addAddress.classList.add("add-address")
            updateAddress.classList.remove("update-none")
            deleteAddress.classList.remove("update-none")
        }
        
        htmlData(res["results"].results)
    })
    
}

document.querySelector("#deleteDataBtn").addEventListener("click", () => {
    fetch("/delete-address")
    .then(res => res.json())
    .then(res => {

        const addAddress = document.querySelector("#addAddress")
        const updateAddress = document.querySelector("#updateAddressData")
        const deleteAddress = document.querySelector("#deleteDataAddress")
        addAddress.classList.remove("add-address")
        updateAddress.classList.add("update-none")
        deleteAddress.classList.add("update-none")

        let dataToRemove = document.querySelector("#parentData");

       document.querySelector("#userDiv").removeChild(dataToRemove)
        

    });
});



htmlData = (data) => {
    let html = ""
    
    html += ` 
    <div class="card" id="parentData">
        <div class="row text-center" id="users-data">
            <div class="col-6">${data.name}</div>
            <div class="col-6">${data.contact}</div>
            <div class="col-6">${data.email}</div>
            <div class="col-6">${data.address}</div>
            <div class="col-6">${data.city}</div>
            <div class="col-6">${data.zipcode}</div>
        </div>
    </div>
    `
    
    insertData.innerHTML = html
}





