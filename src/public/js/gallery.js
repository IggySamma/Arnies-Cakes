let urlParams = new URLSearchParams(window.location.search);
let sectionName = urlParams.get('type');
let domContainer = document.getElementById("galleryContainer");
let galleryContainer = document.getElementsByClassName("galleryWrapper")

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
  let counter = 0
  for(let i = 0; i < data.length; i++){
    if(galleryContainer[counter].childNodes.length === 1){
      const imageContainer = createGalleryElement(
        'div', {loading: "lazy"}
        ,"imageWrapper Type:" + data[i].Type + " ID:" + data[i].ID + " h" + counter + " m-0")
      galleryContainer[counter].appendChild(imageContainer)
      const image = createGalleryElement('img',{src:data[i].Path},"img")
      imageContainer.appendChild(image)
    } else {
      const imageContainer = createGalleryElement(
        'div', {loading: "lazy"}
        ,"imageWrapper Type:" + data[i].Type + " ID:" + data[i].ID + " m-0")
      galleryContainer[counter].appendChild(imageContainer)
      const image = createGalleryElement('img',{src:data[i].Path},"img")
      imageContainer.appendChild(image)
    }

    if(counter === 5){
      counter = 0
    } else {
      counter = counter +1
    }
  }
}
