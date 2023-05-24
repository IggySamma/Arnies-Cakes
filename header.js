/* Gallery */

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

function refreshPage(){
  let type = document.getElementById('select-box');
  location.replace('/Gallery.html?type=' + type.value);
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

/* Flavours */
function showToolTipDiv(id, className) {
  const selectToolTipDiv = document.getElementById(className);
  const Div1 = document.getElementsByClassName('toolTip1');
  const Div2 = document.getElementsByClassName('toolTip2');
  const toolTipMap = new Map([
    ['honey', './Flavours Images/honey cake.jpg'],
    ['napoleon', './Flavours Images/napoleon.jpeg'],
    ['3d', './Flavours Images/3d heart.jpg'],
    ['giftBox', './Flavours Images/giftbox.jpg'],
    ['cakePops', './Flavours Images/cakepops.jpg'],
    ['cakeSicles', './Flavours Images/cakesicles.jpg'],
    ['plikyti', './Flavours Images/plikyti.jpg'],
  ]);

  if (className === 'tt1') {
      for(i = 0; i < Div1.length; i++) {
      selectToolTipDiv.src = toolTipMap.get(id);
      Div1[i].style.display = 'flex';
    }
  } else if (className === 'tt2') {
    for(i = 0; i < Div2.length; i++) {
      selectToolTipDiv.src = toolTipMap.get(id);
      Div2[i].style.display = 'flex';
      if (id === '3d') {
        Div2[i].style.height = '300px';
        Div2[i].style.width = '350px';
        Div2[i].style.right = '10vw';
        Div2[i].style.top = '10%';
      } else {
        Div2[i].style.height = '350px';
        Div2[i].style.width = '250px';
        Div2[i].style.right = '15vw';
        Div2[i].style.top = '5%';
      }
    }
  }
}

function clearTipDiv() {
  const Div1 = document.getElementsByClassName('toolTip1');
  const Div2 = document.getElementsByClassName('toolTip2');
  for(i = 0; i < Div1.length; i++) {
    Div1[0].style.display = 'none';
  }
  for(i = 0; i < Div2.length; i++) {
    Div2[0].style.display = 'none';
  }
}
