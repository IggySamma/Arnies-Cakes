const form = document.getElementById("form");
let activeID = '';

form.addEventListener("submit", submitForm);

function submitForm(file) {
    file.preventDefault();
    const name = document.getElementById("select-box");
    const files = document.getElementById("files");
    const formData = new FormData();
    formData.append("name", name.value);
    for(let i =0; i < files.files.length; i++) {
            formData.append("myFiles", files.files[i]);
    }
    fetch("/api/upload", {
        method: 'POST',
        body: formData,
    })
        //.then((res) => console.log(res))
        //.catch((err) => ("Error occured", err));
}

function getAdminGallery(){
    let array = [];
    let temp = ''; 
    //let data = '';
    fetch('/api/adminGallery', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        //body: JSON.stringify(data),
    })
    .then(response => 
        response.json().then(data => ({
        data: data,
        status: response.status
    }))
    .then(res => {
        array = res.data;
        for (let i = res.data.length-1; i >= 0; i--){
            temp = res.data[i];
            showGallery(temp.ID, temp.Type, temp.Path);
        }}))
}

  
function showGallery(ID, Type, Path){
    const domGalllery = document.getElementById('Gallery');
    const divContainer = document.createElement('div');
    const imgPath = document.createElement('img');
    domGalllery.appendChild(divContainer);
    divContainer.className = (Type + " col m-2 p-3");
    divContainer.setAttribute("data-bs-toggle", "modal");
    divContainer.setAttribute("data-bs-target", "#modalImages");
    divContainer.setAttribute("id", ID);
    divContainer.setAttribute("onclick", "setActive(" + ID + ")");
    domGalllery.appendChild(divContainer);
    imgPath.className = ("img-thumbnail");
    imgPath.src = Path;
    divContainer.appendChild(imgPath);
    showCarousel("carousel" + ID, Path);
}
  
function showCarousel(ID, Path){
    const domCarousel = document.getElementById('carousel');
    const divContainer = document.createElement('div');
    const imgPath = document.createElement('img');
    divContainer.className = ("carousel-item");
    divContainer.setAttribute("id", ID);
    domCarousel.appendChild(divContainer);
    imgPath.src = Path
    imgPath.setAttribute("class", "d-block carImg");
    divContainer.appendChild(imgPath);
}
  
function setActive(ID){
    document.getElementById("carousel" + ID).className = ("carousel-item active");
}

function deleteAlert(){
    const response = confirm("Are you sure you want to delete ?");
    if (response) {
        alert(activeID.replace('carousel', '') + " would be deleted");
        deletePicture(activeID.replace('carousel', ''));
    } else {}
}

function deletePicture(ID){
    //let array = [activeID.replace('carousel', '')];
    /*let temp = ; 
    let data = {temp};*/
    fetch('/api/deleteGallery', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ID}),
    })/*
    .then(response => 
        response.json().then(data => ({
        data: data,
        status: response.status
    }))
    .then(res => {
        array = res.data;
        for (let i = res.data.length-1; i >= 0; i--){
            temp = res.data[i];
            //showGallery(temp.ID, temp.Type, temp.Path);
        }}))*/
}

$(document).ready(function(){
    $("#modalImages").on('hide.bs.modal', function(){
        activeID = document.getElementsByClassName('carousel-item active')[0].id
        document.getElementById(activeID).className = ("carousel-item");
    });
});

