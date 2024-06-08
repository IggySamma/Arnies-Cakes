let urlParams = new URLSearchParams(window.location.search);
let sectionName = urlParams.get('type');
let domContainer = document.getElementById("galleryContainer");
let galleryContainer = document.getElementsByClassName("galleryWrapper")
let dimLength = 0;

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


function insertImages(data){
  let counter = 0;

  for(let i = 0; i < data.length; i++){
    /*if(galleryContainer[counter].childNodes.length === 1){
      /*const imageContainer = createGalleryElement(
        'div', {loading: "lazy"}
        ,"imageWrapper Type:" + data[i].Type + " ID:" + data[i].ID + " " + dimensions[dimLength] + /*" h" + counter + *//*" m-0");
      galleryContainer[counter].appendChild(imageContainer);*/
      /*const image = createGalleryElement('img',{src:data[i].Path, loading: "lazy"},"img" + " " + dimensions[dimLength] + " m-0");
      //imageContainer.appendChild(image);
      galleryContainer[counter].appendChild(image);
      } else {
      /*const imageContainer = createGalleryElement(
        'div', {loading: "lazy"}
        ,"imageWrapper Type:" + data[i].Type + " ID:" + data[i].ID + " " + dimensions[dimLength] + /*" h" + randomInt(0, 6) +*/ /*" m-0");
      galleryContainer[counter].appendChild(imageContainer);*/
      /*const image = createGalleryElement('img',{src:data[i].Path, loading: "lazy"},"img" + " " + dimensions[dimLength] + " m-0");
      //imageContainer.appendChild(image);
      galleryContainer[counter].appendChild(image);
    }
*/

      /*const imageContainer = createGalleryElement(
        'div', {loading: "lazy"}
        ,"imageWrapper Type:" + data[i].Type + " ID:" + data[i].ID + " " + dimensions[dimLength] + " m-0");
      /*galleryContainer[counter].appendChild(imageContainer);
      const image = createGalleryElement('img',{src:data[i].Path, loading: "lazy"},"img"/* + " " + dimensions[dimLength] + " m-0");
      //imageContainer.appendChild(image);
      imageContainer.appendChild(image);*/
    if(dimensions[dimLength].includes("w52")){
      let imageContainer = createGalleryElement(
        'div', {}
        ,"imageWrapper " + dimensions[dimLength].replace("hh0 w52", "h0") + " m-0 p-0");
      galleryContainer[counter].appendChild(imageContainer);
      const image = createGalleryElement('img',{src:data[i].Path, loading: "lazy"},
        "img" + " Type:" + data[i].Type + " ID:" + data[i].ID  + " " + dimensions[dimLength] + " m-0 p-1");
      imageContainer.appendChild(image);
    } else if(dimensions[dimLength].includes("w53")){
      let imageContainer = document.getElementsByClassName("imageWrapper")
      console.log(imageContainer[imageContainer.length-1])
      const image = createGalleryElement('img',{src:data[i].Path, loading: "lazy"},
        "img" + " Type:" + data[i].Type + " ID:" + data[i].ID  + " " + dimensions[dimLength] + " m-0 p-1");
      imageContainer[imageContainer.length-1].appendChild(image);
    } else {
      const image = createGalleryElement('img',{src:data[i].Path, loading: "lazy"},
        "img" + " Type:" + data[i].Type + " ID:" + data[i].ID  + " " + dimensions[dimLength] + " m-0 p-1");
      galleryContainer[counter].appendChild(image);
    }

    if(counter === galleryContainer.length - 1){
      counter = 0;
    } else {
      counter = counter + 1;
    }

    if(dimLength === dimensions.length - 1){
      dimLength = 0;
    } else {
      dimLength = dimLength + 1;
    }
  }
  let widthCheck = document.getElementsByClassName("w51");
  let wrapperCheck = document.getElementsByClassName("imageWrapper");
  if(widthCheck.length > wrapperCheck.length){
    widthCheck[widthCheck.length-1].style.width = "100%";
  }
}

function randomInt(min, max){
  return Math.floor(Math.random() * (max - min) + min); 
}

let dimensions = [
  "h0", "h1",      "h2", "h3", "h4",
  "h3", "h0 w51",  "h1", "h1", "h2",
  "h1", "hh0 w52", "h4", "h1", "h3",
  "h2", "hh0 w53", "h3", "h2", "h1",
  "h4", "h0",      "h2", "h1", "h4",
  "h3", "h4",      "h2", "h3", "h2" 
]


