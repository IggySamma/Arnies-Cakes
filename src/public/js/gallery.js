let sectionName = new URLSearchParams(window.location.search).get('type');

let galleryContainer = document.getElementsByClassName("galleryWrapper")
let colCounter = 0;
let colLength = 0;

let storedGallery;
let lastGalleryIdx = 0;

function getGallery(){
  let data = {sectionName};
  console.log(data)
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
        insertImages(res.data.reverse())
        //infiniteScroll(res.data.length-1, res.data.reverse()).then(observerEntity());
      }) 
    }))
}

function createGalleryElement(type, attributes = {}, classes = "") {
  const element = document.createElement(type);
  if (classes) element.className = classes;
  for (let key in attributes) {
      element.setAttribute(key, attributes[key]);
  }
  return element;
}

async function infiniteScroll(startFrom, data){
  storedGallery = await data;
  if(startfrom + 12 < data.length){
    for(let i = startfrom; i <= startfrom + 12; i++){
      insertImage(data[i].ID, data[i].Type, data[i].Path);
      lastGalleryIdx++;
    }
  } else {
    for(let i = startFrom; i < data.length; i++){
      insertImage(data[i].ID, data[i].Type, data[i].Path);
      lastGalleryIdx++;
    }
  }
  document.getElementById('infiniteScroll')?.forEach((element) =>
    element.remove()
  )
  observerEntity()
}

const observer = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const Element = document.getElementById('infiniteScroll');
      Element?.remove();
      infiniteScroll(lastGalleryIdx-1, storedGallery);
    }
  }
});

function observerEntity(){
  galleryContainer? 
  galleryContainer.forEach((container) => {
    const element = createGalleryElement('div', {id: 'infiniteScroll', invisble}, "m-0 p-0");
    container.appendChild(element);
  })
  :
  (document.getElementsByClassName("galleryContainers").appendChild(
    createGalleryElement('div', {id: 'infiniteScroll', invisble}, "m-0 p-0"))
  )

  const infiniteScrollDiv = document.querySelector("#infiniteScroll");
  observer.observe(infiniteScrollDiv);
}

function insertImages(lastStop, data, colSet){
  for(let i = lastStop; i < data.length; i++){
    if(colSet[colLength].includes("w50")){

      let imageContainer = createGalleryElement(
        'div', {}
        ,"imageWrapper " + colSet[colLength].replace("w50", "") + " m-0 p-0");
      galleryContainer[colCounter].appendChild(imageContainer);

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
      galleryContainer[colCounter].appendChild(createGalleryElement('img',{src:data[i].Path, loading: "lazy"},
        "img" + " Type:" + data[i].Type + " ID:" + data[i].ID  + " " + colSet[colLength] + " m-0 p-1"));
    } 

    if(colCounter === galleryContainer.length - 1){
      colCounter = 0;
    } else {
      colCounter++;
    }

    if(colLength === colSet.length - 1){
      colLength = 0;
    } else {
      colLength++ ;
    }
    
    lastStop++
  }
  /*if adjacent half image in column !exist expand*/
  if(document.getElementsByClassName("w50").length > document.getElementsByClassName("w51").length){
    document.getElementsByClassName("w50")[document.getElementsByClassName("w50").length-1].style.width = "100%";
  }
}

let colLg = [
  "vph40", "vph325", "vph45", "vph725", "vph425",
  "vph325", "vph35", "vph50", "vph375", "vph425 w50", "vph425 w51",
  "vph575", "vph425", "vph275", "vph525", "vph325",
  "vph425", "vph30", "vph55", "vph40", "vph525",
  "vph525", "vph30", "vph65", "vph475", "vph30 w50", "vph30 w51",
  "vph325", "vph475", "vph30", "vph275", "vph65" 
]


/*
function insertImages(data){
  let colCounter = 0;

  for(let i = 0; i < data.length; i++){
    if(colLg[colLength].includes("w50")){
      let imageContainer = createGalleryElement(
        'div', {}
        ,"imageWrapper " + colLg[colLength].replace("w50", "") + " m-0 p-0");
      galleryContainer[colCounter].appendChild(imageContainer);
      const image = createGalleryElement('img',{src:data[i].Path, loading: "lazy"},
        "img" + " Type:" + data[i].Type + " ID:" + data[i].ID  + " " + colLg[colLength] + " m-0 p-1");
      imageContainer.appendChild(image);
      colCounter = colCounter-1
    } else if(colLg[colLength].includes("w51")){
      let imageContainer = document.getElementsByClassName("imageWrapper")
      console.log(imageContainer[imageContainer.length-1])
      const image = createGalleryElement('img',{src:data[i].Path, loading: "lazy"},
        "img" + " Type:" + data[i].Type + " ID:" + data[i].ID  + " " + colLg[colLength] + " m-0 p-1");
      imageContainer[imageContainer.length-1].appendChild(image);
    } else {
      const image = createGalleryElement('img',{src:data[i].Path, loading: "lazy"},
        "img" + " Type:" + data[i].Type + " ID:" + data[i].ID  + " " + colLg[colLength] + " m-0 p-1");
      galleryContainer[colCounter].appendChild(image);
    }

    if(colCounter === galleryContainer.length - 1){
      colCounter = 0;
    } else {
      colCounter++;
    }

    if(colLength === colLg.length - 1){
      colLength = 0;
    } else {
      colLength++ ;
    }
  }
  let widthCheck = document.getElementsByClassName("w50");
  let wrapperCheck = document.getElementsByClassName("imageWrapper");
  if(widthCheck.length > wrapperCheck.length){
    widthCheck[widthCheck.length-1].style.width = "100%";
  }
}
*/
