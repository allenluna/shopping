
let searchMenu = document.querySelector("#searchBody")
let searchArr;
const search = document.querySelector("#search")
fetch("/search-product", {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({"search" : search.value})
}).then(res => res.json()).then(res => {
    searchArr = res["results"]
}).then(() => {
    let searchData = []
    search.addEventListener("input", (e) => {
        let searchValue = e.target.value.toLowerCase();
        searchData.forEach(data => {
            const isVisible = data.title.includes(searchValue);
            data.element.classList.toggle("data", !isVisible)
        })
    })
    
    searchData = searchArr.map(searchProduct => {
        let a = document.createElement("a");
        let div = document.createElement("div");
        let wrapper = document.createElement("div");
        let img = document.createElement("img");
        let hr = document.createElement("hr");
        let p = document.createElement("p");

        a.classList = "text-dark datas"
        div.classList = "search-data";
        wrapper.classList = "search-wrapper d-flex align-items-center";
        img.height = "150"
        img.width = "150"
        img.classList = "my-3"
        

        a.appendChild(div);
        a.appendChild(hr)
        div.appendChild(wrapper);
        wrapper.appendChild(img);
        wrapper.appendChild(p);
        
        a.href = `/preview?q=${searchProduct.id}`
        img.setAttribute("src", `static/img/${searchProduct.image_url.title[0][1]}`);
        p.innerHTML = searchProduct.title;
        

        searchMenu.appendChild(a)
        return {title: searchProduct.title.toLowerCase(), element: a}
    })


})