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
            img.src = ("./Index Images/Main Cake " + i +".jpg")
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
            img.src = ("./Index Images/Main Cake " + i +".jpg")
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
    const ul = document.createElement("ul");
    const li1 = document.createElement("li");
    const a1 = document.createElement("a");

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
    li1.className = ("nav-item m-4 me-5 ms-5 pe-5 ps-5");
    ul.appendChild(li1);
    a1.className = ("nav-link fontsize");
    a1.setAttribute("href", "./Index.html");
    a1.innerHTML = ("Home");
    li1.appendChild(a1);



}
