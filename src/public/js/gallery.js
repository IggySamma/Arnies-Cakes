let sectionNames = new URLSearchParams(window.location.search).get('type');
let galleryContainer = document.getElementById(sectionNames);
galleryContainer.parentNode.classList.add("active")

let vwMax = 1175;
let vw = window.innerWidth;
let galleryWrapper;
//let galleryContainer;
let colCounter = 0;
let colLength = 0;
let columnsSetAs;
let col;

let storedGallery;
let fullGallery;
let lastGalleryIdx = 0;

let carouselContainer = document.getElementById('mainGalleryContainer');

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

/*let colLgImages = [
  "vph40", "vph325", "vph45", "vph725", "vph425",
  "vph325", "vph45", "vph50", "vph375", "vph425 w50", "vph425 w51",
  "vph575", "vph425", "vph275", "vph525", "vph325",
  "vph425", "vph40", "vph55", "vph40", "vph525",
  "vph525", "vph40", "vph65", "vph475", "vph30 w50", "vph30 w51",
  "vph325", "vph475", "vph30", "vph275", "vph65" 
]
*/


window.addEventListener('resize', setColumns);

const Carousel = new bootstrap.Carousel(carouselContainer, {
  touch: true,
  ride: false,
  keyboard: false,
})

function getGallery(param = sectionNames){
  sectionNames = param;
  console.log("Get: " + 1);
  if(fullGallery === undefined){
    console.log("Get: " + 2);
    fetchGallery(sectionNames);
  } else {
    if(sectionNames === "All"){
      console.log("Get: " + 3);
      storedGallery = fullGallery;
      infiniteScroll(0, fullGallery, col)
      return 
    }

    if(fullGallery !== undefined){
      console.log("Get: " + 5);
      storedGallery = [];
      for(let i = 0; i < fullGallery.length; i++){
        if(fullGallery[i].Type === param){
          storedGallery.push(fullGallery[i]);
        }
      }
    }
    console.log("Get: " + 6);
    if(storedGallery.length === 0){
      console.log("Get: " + 7);
      storedGallery = fullGallery;
    }
    console.log("Get: " + 8);
    infiniteScroll(0, storedGallery, col)
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
        //setColumns();
        storeGallery(res.data.reverse()).then(() =>{
          /*infiniteScroll(0, storedGallery, col)*/
          setColumns();
        })       
      }) 
    }))
}

/*function setColumns(){
  let wrapperLG = document.getElementsByClassName("galleryWrapperLG");
  let wrapper = document.getElementsByClassName("galleryWrapper");

  console.log("Set: " + 1);
  if(window.innerWidth >= 1175){
    console.log("Set: " + 2);
    if(vw >= 1175){
      console.log("Set: " + 3);
      console.log("parent: " + wrapperLG[0].parentNode.id)
      console.log("galleryContainer: " + galleryContainer)
      if(wrapperLG.length > 0 && wrapperLG[0].parentNode.id === galleryContainer){
        console.log("Set: " + 4);
        vw = window.innerWidth;
        galleryWrapper = wrapperLG;
        return;
      } else {
        console.log("Set: " + 5);
        colLG.forEach((element) => {
          galleryContainer.appendChild(
            createGalleryElement('div', {id: "galleryContainerLG"}, "galleryWrapperLG " + element + " m-0 p-0")
          )
        });
        vw = window.innerWidth;
        columnsSetAs = "LG";
        galleryWrapper = wrapperLG;
        console.log("Set: " + 6);
        getColumns();
      }
    } else if(vw < 1175){
      if(wrapper.length > 0){
        console.log("Set: " + 7);
        let element = wrapper
        for(let i = element.length-1; i >= 0; i--){
          element[i].remove()
        }
      } 
      console.log("Set: " + 8);
      colLG.forEach((element) => {
        galleryContainer.appendChild(
          createGalleryElement('div', {id: "galleryContainerLG"}, "galleryWrapperLG " + element + " m-0 p-0")
        )
      });
      vw = window.innerWidth;
      columnsSetAs = "LG";
      galleryWrapper = wrapperLG
      console.log("Set: " + 9);
      getColumns();
      infiniteScroll(0, storedGallery, col);
    }
  } else {
    if(window.innerWidth < 1175){
      console.log("Set: " + 10);
      if(wrapperLG.length > 0 && wrapperLG.parentNode.id === galleryContainer){
        console.log("Set: " + 11);
        let element = wrapperLG;
        for(let i = element.length-1; i >= 0; i--){
          element[i].remove()
        }

        colSM.forEach((element) => {
          galleryContainer.appendChild(
            createGalleryElement('div', {id: "galleryContainer"}, "galleryWrapper " + element + " m-0 p-0")
          )
        });
        console.log("Set: " + 12); 
        vw = window.innerWidth;
        galleryWrapper = wrapper
        columnsSetAs = "SM";
        getColumns()
        infiniteScroll(0, storedGallery, col);
      } else {
        console.log("Set: " + 13);
        colSM.forEach((element) => {
            galleryContainer.appendChild(
            createGalleryElement('div', {id: "galleryContainer"}, "galleryWrapper " + element + " m-0 p-0")
          )
        });
        vw = window.innerWidth;
        columnsSetAs = "SM";
        galleryWrapper = wrapper
      }
    }
  }
  console.log("Set: " + 14);
  getColumns();
}*/

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
  document.getElementById('infiniteScroll')?.remove()

  observerEntity()
}

const observer = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    const Element = document.getElementById('infiniteScroll');
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
    createGalleryElement('div', {id: 'infiniteScroll'}, "m-0 p-0"),
    galleryWrapper[0].childNodes[galleryWrapper[0].querySelectorAll('img').length-1]
  )
  //const infiniteScrollDiv = document.querySelector("#infiniteScroll");
  const infiniteScrollDiv = galleryWrapper[0].querySelectorAll('div')[0]
  observer.observe(infiniteScrollDiv);
}

function insertImages(lastStop, data, colSet){
  let stopAt = 0;
  //console.log(data);
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
    console.log(galleryWrapper);
    if(colSet[colLength].includes("w50")){

      let imageContainer = createGalleryElement(
        'div', {}
        ,"imageWrapper " + colSet[colLength].replace("w50", "") + " m-0 p-0");
      galleryWrapper[colCounter].appendChild(imageContainer);

      imageContainer.appendChild(createGalleryElement('img',{src:data[i].Path, loading: "lazy"},
        "img" + " Type:" + data[i].Type + " ID:" + data[i].ID  + " " + colSet[colLength] + " m-0 p-1"));

      colCounter = colCounter-1
    } else if(colSet[colLength].includes("w51")){
        /*if adjacent half image in column exist shrink*/
      if(document.getElementsByClassName("w50")[document.getElementsByClassName("w50").length-1].style.width === "100%"){
        document.getElementsByClassName("w50")[document.getElementsByClassName("w50").length-1].style.width = "50%"
      }
        
      let imageContainer = document.getElementsByClassName("imageWrapper")
      imageContainer[imageContainer.length-1].appendChild(
        createGalleryElement('img',{src:data[i].Path, loading: "lazy"},
        "img" + " Type:" + data[i].Type + " ID:" + data[i].ID  + " " + colSet[colLength] + " m-0 p-1"));
    } else {
      galleryWrapper[colCounter].appendChild(createGalleryElement('img',{src:data[i].Path, loading: "lazy"},
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
  if(document.getElementsByClassName("w50").length > document.getElementsByClassName("w51").length){
    document.getElementsByClassName("w50")[document.getElementsByClassName("w50").length-1].style.width = "100%";
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
  console.log(new URLSearchParams(window.location.search).get('type'))
  //getGallery(new URLSearchParams(window.location.search).get('type'));
}
/*
function setGalleryContainer(){
  galleryContainer = document.getElementById(sectionNames);
  galleryContainer.classList.add("active")
}*/

carouselContainer.addEventListener('slide.bs.carousel', event => {
  window.history.replaceState({},"", (window.location.pathname + '?type=' + document.querySelector("[data-bs-slide-to='" + event.to + "']").innerHTML.replace(' ','')).toString())
  sectionNames = new URLSearchParams(window.location.search).get('type');
  galleryContainer = document.getElementById(sectionNames);
  console.log(galleryContainer)
  getGallery(sectionNames)
})

//setGalleryContainer();