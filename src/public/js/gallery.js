let sectionNames = new URLSearchParams(window.location.search).get('type');

let galleryWrapper;
let galleryContainer = document.getElementById("mainGalleryContainer");
let colCounter = 0;
let colLength = 0;
let columnsSetAs;
let col;

let storedGallery;
let fullGallery;
let lastGalleryIdx = 0;

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

/*
let colLgImages = [
  "vph40", "vph325", "vph45", "vph725", "vph425",
  "vph325", "vph45", "vph50", "vph375", "vph425 w50", "vph425 w51",
  "vph575", "vph425", "vph275", "vph525", "vph325",
  "vph425", "vph40", "vph55", "vph40", "vph525",
  "vph525", "vph40", "vph65", "vph475", "vph30 w50", "vph30 w51",
  "vph325", "vph475", "vph30", "vph275", "vph65" 
]
*/

let vw = window.innerWidth;
window.addEventListener('resize', setColumns);

function getGallery(param = sectionNames){
  if(fullGallery === undefined){
    sectionNames = param;
    fetchGallery(param);
  } else {
    sectionNames = param;
    console.log(sectionNames)

    if(sectionNames === "All")
    {
      storedGallery = fullGallery;
      infiniteScroll(0, fullGallery, col)
      return 
    }

    if(fullGallery !== undefined){
      storedGallery = [];
      for(let i = 0; i < fullGallery.length; i++){
        if(fullGallery[i].Type === param){
          console.log(fullGallery[i])
          storedGallery.push(fullGallery[i]);
        }
      }
    }

    if(storedGallery.length === 0){
      storedGallery = fullGallery;
    }

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
        setColumns();
        storeGallery(res.data.reverse()).then(() =>{
          infiniteScroll(0, storedGallery, col)
        })       
      }) 
    }))
}

function setColumns(){
  if(window.innerWidth >= 1175){
    if(vw >= 1175){
      if(document.getElementsByClassName("galleryWrapperLG").length > 0){
        vw = window.innerWidth;
        galleryWrapper = document.getElementsByClassName("galleryWrapperLG")
        return;
      } else {
        colLG.forEach((element) => {
          galleryContainer.appendChild(
            createGalleryElement('div', {id: "galleryContainerLG"}, "galleryWrapperLG " + element + " m-0 p-0")
          )
        });
        vw = window.innerWidth;
        columnsSetAs = "LG";
        galleryWrapper = document.getElementsByClassName("galleryWrapperLG")
        getColumns();
      }
    } else if(vw < 1175){
      if(document.getElementsByClassName("galleryWrapper").length > 0){
        let element = document.getElementsByClassName("galleryWrapper")
        for(let i = element.length-1; i >= 0; i--){
          element[i].remove()
        }
      } 
      colLG.forEach((element) => {
        galleryContainer.appendChild(
          createGalleryElement('div', {id: "galleryContainerLG"}, "galleryWrapperLG " + element + " m-0 p-0")
        )
      });
      vw = window.innerWidth;
      columnsSetAs = "LG";
      galleryWrapper = document.getElementsByClassName("galleryWrapperLG")
      getColumns();
      infiniteScroll(0, storedGallery, col);
    }
  } else {
    if(window.innerWidth < 1175){
      if(document.getElementsByClassName("galleryWrapperLG").length > 0){
        if(document.getElementsByClassName("galleryWrapperLG").length > 0){
          let element = document.getElementsByClassName("galleryWrapperLG")
          for(let i = element.length-1; i >= 0; i--){
            element[i].remove()
          }
        }
        colSM.forEach((element) => {
          galleryContainer.appendChild(
            createGalleryElement('div', {id: "galleryContainer"}, "galleryWrapper " + element + " m-0 p-0")
          )
        }); 
        vw = window.innerWidth;
        galleryWrapper = document.getElementsByClassName("galleryWrapper")
        columnsSetAs = "SM";
        getColumns()
        infiniteScroll(0, storedGallery, col);
      } else {
        colSM.forEach((element) => {
            galleryContainer.appendChild(
            createGalleryElement('div', {id: "galleryContainer"}, "galleryWrapper " + element + " m-0 p-0")
          )
        });
        vw = window.innerWidth;
        columnsSetAs = "SM";
        galleryWrapper = document.getElementsByClassName("galleryWrapper")
      }
    }
  }
  getColumns();
}

function getColumns(){
  colCounter = 0;
  colLength = 0;
  if(columnsSetAs === "LG"){
    col = colLgImages;
  } else {
    col = colSMImages
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
    document.getElementsByClassName("img")[document.getElementsByClassName("img").length-1].parentNode.insertBefore(
      createGalleryElement('div', {id: 'infiniteScroll'}, "m-0 p-0"),
      document.getElementsByClassName("img")[document.getElementsByClassName("img").length-1]
    )

  const infiniteScrollDiv = document.querySelector("#infiniteScroll");
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
  getGallery(new URLSearchParams(window.location.search).get('type'));
}