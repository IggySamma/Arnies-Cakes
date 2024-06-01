let urlParams = new URLSearchParams(window.location.search);
let sectionName = urlParams.get('type');
let container = document.getElementById("galleryContainer");

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
      return new Promise((resolve) =>{
        //console.log(res.data)
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

//Bootstraps col logic
let widths = [
  8.333333333333333,
  16.66666666666667,
  25,
  33.33333333333333,
  41.66666666666667,
  50,
  58.33333333333333,
  66.66666666666667,
  75,
  83.33333333333333,
  91.66666666666667,
  100
]

function w(idx){ return widths[idx-1] }

/* 
0 <-> 1 <-> 2 <-> 3
*/
let widthCollection = {
    0:[w(3),w(3),w(3),w(3)],
    1:[w(6),w(3),w(3)],
    2:[w(6),w(2),w(2),w(2)],
    3:[w(3),w(3),w(2),w(2),w(2)]
}

function randomSelect(max){
  return Math.floor(Math.random() * max);
}

console.log(Object.keys(widthCollection[2]).length)
console.log(widthCollection[2][randomSelect(4)])

function randomWidth(collection){
  let array = Object.values
  for (let i = 0; i < array.length; i++){
    return
  }
}

/* Logic

  Images are position: absolute to not use grid 

  Width Collections can go into the following pattern with each other
  0 <-> 1 <-> 2 <-> 3 (random selection between 2 nums or 100 and floored % operator for 0 or 1 for moving )

  if collection = 1 or 2 imgaes above and below need to be either 3, 3 or 2, 2, 2 to = 6 

  6 width min-height: 40 max 60% (all images above and below must be level?)

  other image min-height: 40 max 100% (Not to have same height per row)

  Array to hold previous widths and heights and what collection of last "Row" to select next collection and order of display
  

*/










const temp = createGalleryElement('div',{},"col-lg-3 imageWrapper m-0 p-1")
container.appendChild(temp)

const temp2 = createGalleryElement('img',{src:"/gallery/0484592647d0441112d7b1529b6d3905"},"img-thumbnail")
temp.appendChild(temp2)

const temp3 = createGalleryElement('div',{},"col-lg-3 imageWrapper m-0 p-1")
container.appendChild(temp3)

const temp4 = createGalleryElement('img',{src:"/gallery/0484592647d0441112d7b1529b6d3905"},"img-thumbnail")
temp3.appendChild(temp4)

const temp5 = createGalleryElement('div',{},"col-lg-3 imageWrapper m-0 p-1")
container.appendChild(temp5)

const temp6 = createGalleryElement('img',{src:"/gallery/0484592647d0441112d7b1529b6d3905"},"img-thumbnail")
temp5.appendChild(temp6)

const temp7 = createGalleryElement('div',{},"col-lg-3 imageWrapper m-0 p-1")
container.appendChild(temp7)

const temp8 = createGalleryElement('img',{src:"/gallery/0484592647d0441112d7b1529b6d3905"},"img-thumbnail")
temp7.appendChild(temp8)

const temp1 = createGalleryElement('div',{},"col-lg-3 imageWrapper m-0 p-1")
container.appendChild(temp1)

const temp12 = createGalleryElement('img',{src:"/gallery/0484592647d0441112d7b1529b6d3905"},"img-thumbnail")
temp1.appendChild(temp12)

const temp13 = createGalleryElement('div',{},"col-lg-3 imageWrapper m-0 p-1")
container.appendChild(temp13)

const temp14 = createGalleryElement('img',{src:"/gallery/0484592647d0441112d7b1529b6d3905"},"img-thumbnail")
temp13.appendChild(temp14)

const temp15 = createGalleryElement('div',{},"col-lg-3 imageWrapper m-0 p-1")
container.appendChild(temp15)

const temp16 = createGalleryElement('img',{src:"/gallery/0484592647d0441112d7b1529b6d3905"},"img-thumbnail")
temp15.appendChild(temp16)

const temp17 = createGalleryElement('div',{},"col-lg-3 imageWrapper m-0 p-1")
container.appendChild(temp17)

const temp18 = createGalleryElement('img',{src:"/gallery/0484592647d0441112d7b1529b6d3905"},"img-thumbnail")
temp17.appendChild(temp18)