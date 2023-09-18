var urlParams = new URLSearchParams(window.location.search);
var sectionName = urlParams.get('type');
const select = document.getElementById('select-box');
select.value = sectionName;

let activeID = '';

function getGallery(){
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
      //console.log(res.data);
      return new Promise((resolve) =>{
        //storeGalleryData(res.data);
        infiniteScroll(res.data.length-1, res.data).then(observerEntity());
        
      }) 
    /*
    for (let i = res.data.length-1; i >= 0; i--){
      //temp = res.data[i];
      //storeGallery(res.data[i])
      //showGallery(temp.ID, temp.Type, temp.Path);
    }*/}))
}

/*
async function storeGalleryData(data){
  const temp = await data;
  infiniteScroll(temp.length-1,temp)
}*/

async function infiniteScroll(lastStop, data){
  storedGallery = await data;
  console.log(lastStop);
  console.log(lastStop-6)
  if(lastStop > 6){
    for(let i = lastStop; i >= lastStop-6; i--){
      showGallery(data[i].ID, data[i].Type, data[i].Path);
      lastGalleryIdx = i;
      if(i === lastStop-6){
        const Element = document.getElementById('infiniteScroll');
        Element?.remove();
        observerEntity(); 
      }
    }
  } else {
    for(let i = lastStop; i >= 0; i--){
      showGallery(data[i].ID, data[i].Type, data[i].Path);
      lastGalleryIdx = i;
      if(i === 0){
        const Element = document.getElementById('infiniteScroll');
        Element?.remove();
        observerEntity();
      }
    }
  }
}

let storedGallery;
let lastGalleryIdx;


const observer = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      console.log("testing")
      const Element = document.getElementById('infiniteScroll');
      Element?.remove();
      
      infiniteScroll(lastGalleryIdx-1, storedGallery);
    }
  }
});

function observerEntity(){
  const element = document.getElementById('Gallery');
  const div = document.createElement('div');
  div.className = ("col m-1 p-1 pe-auto");
  div.setAttribute("id", "infiniteScroll");
  element.appendChild(div);

  const infiniteScrollDiv = document.querySelector("#infiniteScroll");
  observer.observe(infiniteScrollDiv);
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
