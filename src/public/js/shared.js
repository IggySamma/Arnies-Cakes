function sideScroll() {
    const attach = document.getElementById("sideScroll");
    const container = document.createElement('div');
    const row = document.createElement('div');
    const colContain = document.createElement('div');
    const colContainTwo = document.createElement('div');

    const rowL = document.createElement('div');
    const rowR = document.createElement('div');

    attach.className = ("row sideScrollContainer");
    container.className = ("col homeImageContainer");
    attach.appendChild(container);
    rowL.className = ("row sideScrollL m-1 d-inline-block")
    container.appendChild(rowL);
    rowR.className = ("row sideScrollR m-1 d-inline-block")
    container.appendChild(rowR);

    for(let j = 0; j <=1;j++){
        for (let i = 1; i <= 3; i++) {
            const col = document.createElement('div');
            const img = document.createElement('img');

            col.className = ("col p-0 my-1 py-1");
            rowL.appendChild(col);
            img.className = ("homeImage");
            img.setAttribute("loading","lazy")
            img.src = ("./images/Sidescroll/" + i +".jpg")
            col.appendChild(img);
        }
        colContainTwo.className = ("col d-flex flex-column");
        row.appendChild(colContainTwo);
        for (let i = 4; i <= 6; i++) {
            const col = document.createElement('div');
            const img = document.createElement('img');

            col.className = ("col p-0 my-1 py-1");
            rowR.appendChild(col);
            img.className = ("homeImage");
            img.setAttribute("loading","lazy")
            img.src = ("./images/Sidescroll/" + i +".jpg")
            col.appendChild(img);
        }  
    } 
}

function navBar(){
    const attach = document.getElementById("navbar");
    const containerFluid = document.createElement("div");
    /*const hr = document.createElement("hr");*/
    const toggleButton = document.createElement("button");
    const spanIcon = document.createElement("span")
    const mainDiv = document.createElement("div");
    const dropDiv = document.createElement("div");
    const ul = document.createElement("ul");
    const li1 = document.createElement("li");
    const li2 = document.createElement("li");
    const li3 = document.createElement("li");
    const li4 = document.createElement("li");
    const li5 = document.createElement("li");
    const li6 = document.createElement("li");
    const li7 = document.createElement("li");

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
    const a11 = document.createElement("a");
    const a12 = document.createElement("a");
    const a13 = document.createElement("a");

    const logoContain = document.createElement("img");
    const imgContain = document.createElement("img");
 
    attach.className = ("navbar fixed-top navbar-expand-lg");

    containerFluid.className = ("container-fluid m-0 p-0 navContainer");
    attach.appendChild(containerFluid)

    toggleButton.className = ("navbar-toggler collapsed");
    toggleButton.setAttribute("type", "button");
    toggleButton.setAttribute("id", "toggling");
    toggleButton.setAttribute("data-bs-toggle", "collapse");
    toggleButton.setAttribute("data-bs-target", "#navbarSupportedContent");
    spanIcon.className = ("navbar-toggler-icon")
    toggleButton.appendChild(spanIcon);
 
    containerFluid.appendChild(toggleButton);
 
    mainDiv.className = ("collapse navbar-collapse justify-content-center");
    mainDiv.setAttribute("id", "navbarSupportedContent");
    mainDiv.style.top = "0";
    containerFluid.appendChild(mainDiv);
 
    ul.className = ("navbar-nav");
    mainDiv.appendChild(ul);
    //Logo
    li5.className = ("nav-item nav-logo");
    ul.appendChild(li5);
    a13.setAttribute('href', './Index.html')
    li5.appendChild(a13)
    logoContain.className = ('navBarLogo');
    logoContain.setAttribute('src', './images/home logo.png');
    a13.appendChild(logoContain);
    //Home
    li1.className = ("nav-item");
    ul.appendChild(li1);
    a1.className = ("nav-link active fontsize");
    a1.setAttribute("href", "./Index.html");
    a1.innerHTML = ("Home");
    li1.appendChild(a1);
    //About Me
    li6.className = ("nav-item");
    ul.appendChild(li6);
    a11.className = ("nav-link fontsize");
    a11.setAttribute("href", "./About.html");
    a11.innerHTML = ("About Me");
    li6.appendChild(a11);
    //Gallery Dropdown
    li2.className = ("nav-item dropdown");
    ul.appendChild(li2);
    a2.className = ("nav-link dropdown-toggle fontsize");
    a2.setAttribute("href", "#");
    a2.setAttribute("id", "navbarDropdown");
    a2.setAttribute("role", "button");
    a2.setAttribute("data-bs-toggle", "dropdown");
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
    //Contact ME
    li7.className = ("nav-item");
    ul.appendChild(li7);
    a12.className = ("nav-link fontsize");
    a12.setAttribute("href", "./Contact.html");
    a12.innerHTML = ("Contact Me");
    li7.appendChild(a12);
    //Flavours
    li3.className = ("nav-item");
    ul.appendChild(li3);
    a9.className = ("nav-link fontsize");
    a9.setAttribute("href", "./Flavours.html");
    a9.innerHTML = ("Flavours");
    li3.appendChild(a9);
    //Enquires
    li4.className = ("nav-item");
    ul.appendChild(li4);
    imgContain.className = ("ribbon");
    imgContain.setAttribute("src", "./images/ribbon.png");
    li4.appendChild(imgContain);
    a10.className = ("nav-link fontsize");
    a10.setAttribute("href", "./Enquiries.html");
    a10.innerHTML = ("Enquiries");
    li4.appendChild(a10);
}

var prevScrollpos = window.scrollY;
var navCollapse = new bootstrap.Collapse(document.getElementById("navbar"))
window.onscroll = function() {
  var currentScrollPos = window.scrollY;
  if (prevScrollpos > currentScrollPos) {
    if(window.matchMedia("(max-width: 992px)")){
        navCollapse.show();
    }
    document.getElementById("navbar").style.top = "0";
  } else {
    if(window.matchMedia("(max-width: 992px)")){
        navCollapse.hide();
    }
    document.getElementById("navbar").style.top = "-150px";
  }
  prevScrollpos = currentScrollPos;
}