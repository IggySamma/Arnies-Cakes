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
