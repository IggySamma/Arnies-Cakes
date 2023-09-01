var urlParams = new URLSearchParams(window.location.search);
var sectionName = urlParams.get('type');
const select = document.getElementById('select-box');
select.value = sectionName;

let activeID = '';

function getGallery(){
  let array = [];
  let temp = ''; 
  let data = {sectionName};
  fetch('/api/gallery', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
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

$(document).ready(function(){
  $("#modalImages").on('hide.bs.modal', function(){
    activeID = document.getElementsByClassName('carousel-item active')[0].id
    document.getElementById(activeID).className = ("carousel-item");
  });
});



function showGallery(ID, Type, Path){
  const domGalllery = document.getElementById('Gallery');
  const divContainer = document.createElement('div');
  const imgPath = document.createElement('img');
  domGalllery.appendChild(divContainer);
  divContainer.className = (Type + " col m-1 p-1 pe-auto");
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

function refreshPage(){
  let type = document.getElementById('select-box');
  location.replace('/Gallery.html?type=' + type.value);
}
