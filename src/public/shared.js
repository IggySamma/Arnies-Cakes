function sideScroll() {
    const attach = document.getElementById("sideScroll");
    const container = document.createElement('div');
    const row = document.createElement('div');
    const colContain = document.createElement('div');
    const colContainTwo = document.createElement('div');

    container.className = ("container d-inline-flex homeImageContainer m-2 p-2");
    attach.appendChild(container);
    row.className = ("row d-inline-flex");
    container.appendChild(row);
    colContain.className = ("col d-flex flex-column");
    row.appendChild(colContain);
    for(let j = 0; j <=1;j++){
        for (let i = 1; i <= 3; i++) {
            const col = document.createElement('div');
            const img = document.createElement('img');

            col.className = ("col imageAnimationL my-1 py-1");
            colContain.appendChild(col);
            img.className = ("homeImage");
            img.src = ("./images/Main Cake " + i +".jpg")
            col.appendChild(img);
        }
        colContainTwo.className = ("col d-flex flex-column");
        row.appendChild(colContainTwo);
        for (let i = 4; i <= 6; i++) {
            const col = document.createElement('div');
            const img = document.createElement('img');

            col.className = ("col imageAnimationR my-1 py-1");
            colContainTwo.appendChild(col);
            img.className = ("homeImage");
            img.src = ("./images/Main Cake " + i +".jpg")
            col.appendChild(img);
        }  
    } 
}

function navBar(){
    const attach = document.getElementById("navbar");
    const hr = document.createElement("hr");
    const toggleButton = document.createElement("button");
    const spanIcon = document.createElement("span")
    const mainDiv = document.createElement("div");
    const dropDiv = document.createElement("div");
    const ul = document.createElement("ul");
    const li1 = document.createElement("li");
    const li2 = document.createElement("li");
    const li3 = document.createElement("li");
    const li4 = document.createElement("li");
    const a1 = document.createElement("a");
    const a2 = document.createElement("a");
    const a3 = document.createElement("a");
    const a4 = document.createElement("a");
    const a5 = document.createElement("a");
    const a6 = document.createElement("a");
    const a7 = document.createElement("a");
    const a8 = document.createElement("a");
    const a9 = document.createElement("a");
    const a10 = document.createElement("a");
    const imgContain = document.createElement("img");
 
    attach.className = ("navbar fixed-top navbar-expand-sm navbar-dark shadow-5-strong");
    hr.className = ("hr-line");
    hr.setAttribute("id","hrline");
    attach.appendChild(hr);
    toggleButton.className = ("navbar-toggler");
    toggleButton.setAttribute("type", "button");
    toggleButton.setAttribute("id", "toggling");
    toggleButton.setAttribute("data-toggle", "collapse");
    toggleButton.setAttribute("data-target", "#navbarSupportedContent");
    spanIcon.className = ("navbar-toggler-icon")
    toggleButton.appendChild(spanIcon);
 
    attach.appendChild(toggleButton);
 
    mainDiv.className = ("collapse navbar-collapse justify-content-center");
    mainDiv.setAttribute("id", "navbarSupportedContent");
    attach.appendChild(mainDiv);
 
    ul.className = ("navbar-nav");
    mainDiv.appendChild(ul);
    //Home
    li1.className = ("nav-item m-4 me-5 ms-5 pe-5 ps-5");
    ul.appendChild(li1);
    a1.className = ("nav-link fontsize");
    a1.setAttribute("href", "./Index.html");
    a1.innerHTML = ("Home");
    li1.appendChild(a1);
    //Gallery Dropdown
    li2.className = ("nav-item m-4 me-5 ms-5 pe-5 ps-5 dropdown");
    ul.appendChild(li2);
    a2.className = ("nav-link dropdown-toggle fontsize");
    a2.setAttribute("href", "#");
    a2.setAttribute("id", "navbarDropdown");
    a2.setAttribute("role", "button");
    a2.setAttribute("data-toggle", "dropdown");
    a2.innerHTML = ("Gallery");
    li2.appendChild(a2);
    //Gallery items
    dropDiv.className = ("dropdown-menu fontsize");
    li2.appendChild(dropDiv);
    a3.className = ("dropdown-item");
    a3.setAttribute("href", "./Gallery.html?type=All");
    a3.innerHTML = ("All");
    dropDiv.appendChild(a3);
    a4.className = ("dropdown-item");
    a4.setAttribute("href", "./Gallery.html?type=Cakes");
    a4.innerHTML = ("Cakes");
    dropDiv.appendChild(a4);
    a5.className = ("dropdown-item");
    a5.setAttribute("href", "./Gallery.html?type=Cakepops");
    a5.innerHTML = ("Cakepops");
    dropDiv.appendChild(a5);
    a6.className = ("dropdown-item");
    a6.setAttribute("href", "./Gallery.html?type=Cupcakes");
    a6.innerHTML = ("Cupcakes");
    dropDiv.appendChild(a6);
    a7.className = ("dropdown-item");
    a7.setAttribute("href", "./Gallery.html?type=KidsCakes");
    a7.innerHTML = ("KidsCakes");
    dropDiv.appendChild(a7);
    a8.className = ("dropdown-item");
    a8.setAttribute("href", "./Gallery.html?type=Treats");
    a8.innerHTML = ("Treats");
    dropDiv.appendChild(a8);
    //Flavours
    li3.className = ("nav-item m-4 me-5 ms-5 pe-5 ps-5");
    ul.appendChild(li3);
    a9.className = ("nav-link fontsize");
    a9.setAttribute("href", "./Flavours.html");
    a9.innerHTML = ("Flavours");
    li3.appendChild(a9);
    //Enquires
    li4.className = ("nav-item m-4 me-5 ms-5 pe-5 ps-5");
    ul.appendChild(li4);
    imgContain.className = ("ribbon");
    imgContain.setAttribute("src", "./images/ribbon.png");
    li4.appendChild(imgContain);
    a10.className = ("nav-link fontsize");
    a10.setAttribute("href", "./Enquires.html");
    a10.innerHTML = ("Enquires");
    li4.appendChild(a10);
    document.getElementById("toggling").addEventListener("click", updateHrLine);
}

function updateHrLine(){
    const check1 = document.getElementById("navbarSupportedContent");
    const line = document.getElementById("hrline");

    if (check1.classList.contains('show') !== true) {
        line.style.border = '100vh solid #D3BBDD';
        line.style.width = '100%'
    } else {
        line.style.border = '20px solid #D3BBDD';
    };
};