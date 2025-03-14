let sectionNames = new URLSearchParams(window.location.search).get('type');
let galleryContainer = document.getElementById(sectionNames);
galleryContainer.parentNode.classList.add("active")
window.history.replaceState({},"", (window.location.pathname.replace('.html','') + '?type=' + sectionNames).toString())

let links = document.querySelectorAll('.carousel-button');
links.forEach(link => {
  if (link.innerHTML.replace(' ','') == sectionNames){
    link.classList.add('active');
  }
})

let vwMax = 1175;
let vw = window.innerWidth;
let galleryWrapper;
let colCounter = 0;
let colLength = 0;
let columnsSetAs;
let col;

let storedGallery;
let fullGallery;
let lastGalleryIdx = 0;

let carouselContainer = document.getElementById('mainGalleryContainer');

let modalCarousel = document.getElementById('lightBoxContent')
let modal = new bootstrap.Carousel(modalCarousel)
let modalView = document.getElementById('lightBox')
let imageId;

if(vw >= vwMax){
  columnsSetAs = "LG"
} else {
  columnsSetAs = "SM"
}

let colSM = [
  "col-6",
  "col-6"
]

let colSMImages = [
  "vph45", "vph40", 
  "vph375", "vph475", 
  "vph425", "vph475" 
]

let colLG = [
  "col-lg-2-25",
  "col-lg-2",
  "col-lg-2-75",
  "col-lg-1-75",
  "col-lg-3-25"
]

let colLgImages = [
  "vph40", "vph325", "vph45", "vph675", "vph425",
  "vph325", "vph425", "vph50", "vph375", "vph425 w50", "vph425 w51",
  "vph575", "vph45", "vph275", "vph525", "vph325",
  "vph425", "vph475", "vph55", "vph40", "vph525",
  "vph525", "vph425", "vph65", "vph425", "vph30 w50", "vph30 w51",
  "vph325", "vph45", "vph30", "vph275", "vph65" 
]

window.addEventListener('resize', setColumns);

const Carousel = new bootstrap.Carousel(carouselContainer, {
  touch: true,
  ride: false,
  keyboard: false,
})

function getGallery(param = sectionNames){
  sectionNames = param;
  galleryWrapper = galleryContainer.childNodes;
  
  if(fullGallery === undefined){
    fetchGallery(sectionNames);
  } else {
    if(sectionNames === "All"){
      
      storedGallery = fullGallery;
      setColumns();
    }

    if(fullGallery !== undefined){
      
      storedGallery = [];
      for(let i = 0; i < fullGallery.length; i++){
        if(fullGallery[i].Type === param){
          storedGallery.push(fullGallery[i]);
        }
      }
    }
    
    if(storedGallery.length === 0){
      
      storedGallery = fullGallery;
    }
    
    setColumns();
  }
}

function fetchGallery(params = sectionNames){
  let data = {params};
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
      return new Promise((resolve) =>{
        storeGallery(res.data.reverse()).then(() =>{
          setColumns();
        })       
      }) 
    }))
}

function setColumns(){
  let children = galleryContainer.childNodes;
  if(window.innerWidth >= vwMax && vw >= vwMax){
    columnsSetAs = "LG"

    if(children.length === 0 || children.length === undefined){
      createColumns("LG");
      return
    }

    if(children.length < colLG.length){
      destroyChildren(children);
      createColumns("LG");
      return;
    }
    return;
  }

  if(window.innerWidth < vwMax && vw < vwMax){
    columnsSetAs = "SM"

    if(children.length === 0 || children.length === undefined){
      createColumns("SM");
      return
    }

    if(children.length > colSM.length){
      destroyChildren(children);
      createColumns("SM");
      return
    }
    return;
  }
  
  if(window.innerWidth >= vwMax && vw < vwMax){
    columnsSetAs = "LG"
    if(children.length === 0 || children.length === undefined){
      createColumns("LG");
      return;
    } else {
      destroyChildren(children);
      createColumns("LG");
      return;
    }
  } else {
    columnsSetAs = "SM"
    if(children.length === 0 || children.length === undefined){
      createColumns("SM");
      return;
    } else {
      destroyChildren(children);
      createColumns("SM");
      return;
    }
  }
}

function destroyChildren(children){
  for(let i = children.length -1; i >= 0; i--){
    children[i].remove()
  }
}

function createColumns(size = "LG"){
  vw = window.innerWidth;
  colCounter = 0;
  colLength = 0;

  if(size === "LG"){
    col = colLgImages
    colLG.forEach((element) => {
      galleryContainer.appendChild(
        createGalleryElement('div', {id: "galleryContainerLG"}, "galleryWrapperLG " + element + " m-0 p-0")
      )
    });
  } else {
    col = colSMImages
    colSM.forEach((element) => {
      galleryContainer.appendChild(
        createGalleryElement('div', {id: "galleryContainer"}, "galleryWrapper " + element + " m-0 p-0")
      )
    });
  }

  galleryWrapper = galleryContainer.childNodes;
  if(storedGallery !== undefined){
    infiniteScroll(0, storedGallery, col);
  }
}

function createGalleryElement(type, attributes = {}, classes = "") {
  const element = document.createElement(type);
  if (classes) element.className = classes;
  for (let key in attributes) {
      element.setAttribute(key, attributes[key]);
  }
  return element;
}

async function storeGallery(data){
  if(storedGallery === undefined){
    storedGallery = await data;
      if(sectionNames === 'All'){
      fullGallery = storedGallery
      }
  } else {
    if(sectionNames === 'All'){
      if(fullGallery === undefined){
        storedGallery = await data;
      }
      fullGallery = storedGallery;
    } else {
      storedGallery = await data;
      sectionNames = new URLSearchParams(window.location.search).get('type')
    }
  }
}

function infiniteScroll(startFrom, data, colSet){
  insertImages(startFrom, data, colSet);
  //document.getElementById('infiniteScroll')?.remove()
  galleryWrapper[0].querySelectorAll('div.infiniteScroll')[0]?.remove();
  
  observerEntity()
}

const observer = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    const Element = galleryWrapper[0].querySelectorAll('div.infiniteScroll')[0]
    
    if(lastGalleryIdx >= storedGallery.length){
      Element?.remove();
      return
    }
    if (entry.isIntersecting) {
      Element?.remove();
      infiniteScroll(lastGalleryIdx, storedGallery, col);
    }
  }
});

function observerEntity(){
  galleryWrapper[0].insertBefore(
    createGalleryElement('div', {id: 'infiniteScroll'}, "infiniteScroll m-0 p-0"),
    galleryWrapper[0].childNodes[galleryWrapper[0].querySelectorAll('img').length-1]
  )
  const infiniteScrollDiv = galleryWrapper[0].querySelectorAll('div')[0]
  observer.observe(infiniteScrollDiv);
}

function insertImages(lastStop, data, colSet){
  let stopAt = 0;
  if(columnsSetAs === "LG"){
    if(data.length < lastStop + 16){
      stopAt = data.length;
    } else {
      stopAt = lastStop + 16;
    }
  } else {
    if(data.length < lastStop + 2){
      stopAt = data.length;
    } else {
      stopAt = lastStop + 2;
    }
  }

  if(lastStop >= stopAt){
    return 
  }


  for(let i = lastStop; i < stopAt; i++){
    if(colSet[colLength].includes("w50")){

      let imageContainer = createGalleryElement(
        'div', {}
        ,"imageWrapper " + colSet[colLength].replace("w50", "") + " m-0 p-0");
      galleryWrapper[colCounter].appendChild(imageContainer);

      imageContainer.appendChild(createGalleryElement('img',{src:data[i].Path, loading: "lazy", "data-bs-toggle": "modal", "data-bs-target": "#lightBox", "onclick": "activeId('" + data[i].ID + "')"},
        "img" + " Type:" + data[i].Type + " ID:" + data[i].ID  + " " + colSet[colLength] + " m-0 p-1"));

      colCounter = colCounter-1
    } else if(colSet[colLength].includes("w51")){
        /*if adjacent half image in column exist shrink*/
      if(galleryWrapper[galleryWrapper.length-1].getElementsByClassName("w50")[galleryWrapper[galleryWrapper.length-1].getElementsByClassName("w50").length-1].style.width === "100%"){
        galleryWrapper[galleryWrapper.length-1].getElementsByClassName("w50")[galleryWrapper[galleryWrapper.length-1].getElementsByClassName("w50").length-1].style.width = "50%"
      }  
      let imageContainer = galleryWrapper[colCounter].getElementsByClassName("imageWrapper")[galleryWrapper[colCounter].getElementsByClassName("imageWrapper").length-1]
      imageContainer.appendChild(
        createGalleryElement('img',{src:data[i].Path, loading: "lazy", "data-bs-toggle": "modal", "data-bs-target": "#lightBox", "onclick": "activeId('" + data[i].ID  + "')"},
        "img" + " Type:" + data[i].Type + " ID:" + data[i].ID  + " " + colSet[colLength] + " m-0 p-1"));
    } else {
      galleryWrapper[colCounter].appendChild(createGalleryElement('img',{src:data[i].Path, loading: "lazy", "data-bs-toggle": "modal", "data-bs-target": "#lightBox", "onclick": "activeId('" + data[i].ID + "')"},
        "img" + " Type:" + data[i].Type + " ID:" + data[i].ID  + " " + colSet[colLength] + " m-0 p-1"));
    } 
    if(colCounter === checkColumnsSet()){
      colCounter = 0;
    } else {
      colCounter++;
    }

    if(colLength === colSet.length - 1){
      colLength = 0;
    } else {
      colLength++ ;
    }
    
  }
  /*if adjacent half image in column !exist expand*/
  if(galleryWrapper[galleryWrapper.length-1].getElementsByClassName("w50").length > galleryWrapper[galleryWrapper.length-1].getElementsByClassName("w51").length){
    galleryWrapper[galleryWrapper.length-1].getElementsByClassName("w50")[galleryWrapper[galleryWrapper.length-1].getElementsByClassName("w50").length-1].style.width = "100%";
  }

  lastGalleryIdx = stopAt;
}

function checkColumnsSet(){
  if(columnsSetAs === "LG"){
    return colLG.length -1;
  } else {
    return colSM.length -1;
  }
}

function setNewParam(element){
  window.history.replaceState({},"", (window.location.pathname + '?type=' + element.innerHTML.replace(' ','')).toString())
}

carouselContainer.addEventListener('slide.bs.carousel', event => {
  document.getElementsByClassName('galleryContainers')[0].scrollTo(0,0); /* Scroll to top on change */
  window.history.replaceState({},"", (window.location.pathname + '?type=' + document.querySelector("[data-bs-slide-to='" + event.to + "']").innerHTML.replace(' ','')).toString())
  sectionNames = new URLSearchParams(window.location.search).get('type');
  galleryContainer = document.getElementById(sectionNames);

  let to  = document.querySelector("[data-bs-slide-to='" + event.to + "']").innerHTML;
  let from = document.querySelector("[data-bs-slide-to='" + event.from + "']");

  links = document.querySelectorAll('.carousel-button');
  links.forEach(link => {
    if (link.innerHTML == to){
      link.classList.add('active');
      from.classList.remove('active');
    }
  })

  getGallery(sectionNames)
})

function activeId(id){
  imageId = id;
  if(document.getElementById(id) !== null && document.getElementById(id) !== undefined){
    document.getElementById(id).classList.add("active")
  }
}

function buildModal(gallery){
  let container = document.getElementById("modal-carousel")
  for(let i = 0; i < gallery.length; i++){
    let wrapper = createGalleryElement('div', {"id": gallery[i].ID}, "carousel-item modalWrapper carousel-fade")
    wrapper.appendChild(createGalleryElement('img', {src:gallery[i].Path, loading: "lazy"}, "modalImages pt-3"))
    container.appendChild(wrapper)
  }
}

function destoryModal(){
  if(document.getElementById(imageId) !== null && document.getElementById(imageId).className.includes("active")){
    document.getElementById(imageId).classList.remove("active")
  }
  let container = document.getElementById("modal-carousel").childNodes
  for(let i = container.length - 1; i >= 0; i--){
    container[i].remove()
  }
  let modalContent = document.getElementById("lightBoxContent")
  modalContent.style.aspectRatio = 0.75/1;
}

modalCarousel.addEventListener('slide.bs.carousel', event => { 
  imageId = document.getElementsByClassName("modalWrapper")[event.to].id 
});

modalView.addEventListener('hide.bs.modal', () => {
  if(document.getElementById(imageId) !== null && document.getElementById(imageId) !== undefined){
    document.getElementById(imageId).classList.remove("active")
    destoryModal()
  }
});

modalView.addEventListener('show.bs.modal', () => {
  buildModal(storedGallery)
});

function deleteAlert(){
  const response = confirm("Are you sure you want to delete ?");
  const parentPath = document.getElementsByClassName('ID:' + imageId)[0].src;;
  const pathSrc = parentPath.substring(parentPath.lastIndexOf('/'));
  
  if (response) {
      deletePicture(imageId, pathSrc.substring(1));
  }
}

function deletePicture(ID, Path){
  fetch('/api/deleteGallery', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ID, Path}),
      credentials: "include",
  }).then((res) => {
      if(res.status === 200){
          location.reload();
      } else {
          console.log(res);
      }
  }); 
}