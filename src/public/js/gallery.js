let urlParams = new URLSearchParams(window.location.search);
let sectionName = urlParams.get('type');
let domContainer = document.getElementById("galleryContainer");

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
        buildCollection(res.data)
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

let heights = [
  5,    //1
  10,   //2
  15,   //3
  20,   //4
  25,   //5
  30,   //6
  35,   //7
  40,   //8
  45,   //9
  50,   //10
  55,   //11
  60,   //12
  65,   //13
  70,   //14
  75,   //15
  80,   //16
  85,   //17
  90,   //18
  95,   //19
  100   //20
]

function w(idx){ return widths[idx-1] }
function h(idx){ return heights[idx-1] }


let widthsCollection = {
    0:[w(3),w(3),w(3),w(3)],
    1:[w(6),w(3),w(3)],
    2:[w(2),w(2),w(2),w(3),w(3)],
    3:[w(2),w(2),w(2),w(6)],
    4:[w(4),w(2),w(3),w(3)],
    5:[w(4),w(5),w(3)],
}

let heightsCollection = {
  0:[h(8),h(8),h(10),h(6)],
  1:[h(10),h(6),h(10)],
  2:[h(8),h(8),h(8),h(8),h(8)],
  3:[h(8),h(8),h(8),h(8)],
  4:[h(8),h(8),h(8),h(8)],
  5:[h(8),h(8),h(8)],
}

function randomSelect(min, max){
  return Math.floor(Math.random() * (max - min) + min);
}

//collectionMemory mutates and reduces as used

/*final form should be
  collectionMemory = {
    widths: [],
    heights: [],
    gallery: []
  }
*/

let collectionMemory = {
  required: null,
  count: 0,
  previous: null,
  current: null,
  widths: [],
  heights: [],
  gallery: null
}

function collectionCheck(){
  if(collectionMemory.count === collectionMemory.required){
    return true
  } else if(collectionMemory.count > collectionMemory.required){
    return true
  } else {
    return false
  }
}

function collectionIncrease(bool){
  if(bool === true){
    collectionMemory.previous = collectionMemory.current
    collectionMemory.current += 1
    collectionMemory.count += widthsCollection[collectionMemory.current].length
    collectionMemory.widths.push(widthsCollection[collectionMemory.current])
    collectionMemory.heights.push(heightsCollection[collectionMemory.current])
    return

  } else {
    collectionMemory.previous = collectionMemory.current
    collectionMemory.current -= 1
    collectionMemory.count += widthsCollection[collectionMemory.current].length
    collectionMemory.widths.push(widthsCollection[collectionMemory.current])
    collectionMemory.heights.push(heightsCollection[collectionMemory.current])
    return
  }
}

function buildCollection(data){
  
  if(collectionCheck() === true){

    widthsCollection = undefined
    delete widthsCollection
    widths = undefined
    delete widths
    heightsCollection = undefined
    delete heightsCollection
    heights = undefined
    delete heights


    cleanCollection()
    insertImages()
    return
  }

  if(collectionMemory.required === null){
    if(data.length !== 0){
      collectionMemory.required = data.length
      collectionMemory.gallery = data
      return buildCollection(collectionMemory.gallery)
    } else {
      console.log("Api fetch error, no data")
      return 504
    }
  }

  if(collectionMemory.previous === null){
    collectionMemory.previous = randomSelect(0, (Object.keys(widthsCollection).length - 1))
    collectionMemory.count += widthsCollection[collectionMemory.previous].length
    collectionMemory.widths.push(widthsCollection[collectionMemory.previous])
    collectionMemory.heights.push(heightsCollection[collectionMemory.previous])
    return buildCollection(collectionMemory.gallery)
  }

  if(collectionMemory.current === null){
    if(collectionMemory.previous === 0){
      collectionMemory.current = 1
      collectionMemory.widths.push(widthsCollection[collectionMemory.current])
      collectionMemory.heights.push(heightsCollection[collectionMemory.current])
      return buildCollection(collectionMemory.gallery)
    }
  
    else if(collectionMemory.previous === (Object.keys(widthsCollection).length - 1)){
      collectionMemory.current = (Object.keys(widthsCollection).length - 2)
      collectionMemory.widths.push(widthsCollection[collectionMemory.current]) 
      collectionMemory.heights.push(heightsCollection[collectionMemory.current])
      return buildCollection(collectionMemory.gallery)
    }

    else {
      if(randomSelect(0,1) === 1){
        collectionMemory.current = (collectionMemory.previous + 1)
        collectionMemory.widths.push(widthsCollection[collectionMemory.current]) 
        collectionMemory.heights.push(heightsCollection[collectionMemory.current])
        return buildCollection(collectionMemory.gallery)
      } else {
        collectionMemory.current = (collectionMemory.previous - 1)
        collectionMemory.widths.push(widthsCollection[collectionMemory.current]) 
        collectionMemory.heights.push(heightsCollection[collectionMemory.current])
        return buildCollection(collectionMemory.gallery)
      }
    }
  }

  if(collectionMemory.current === 0){
    collectionIncrease(true)
    return buildCollection(collectionMemory.gallery)
  }

  if(collectionMemory.current === (Object.keys(widthsCollection).length - 1)){
    collectionIncrease(false)
    return buildCollection(collectionMemory.gallery)
  }

  if(collectionMemory.current > collectionMemory.previous){
    collectionIncrease(true)
    return buildCollection(collectionMemory.gallery)
  }

  if(collectionMemory.current < collectionMemory.previous){
    collectionIncrease(false)
    return buildCollection(collectionMemory.gallery)
  }

  console.log("Something went wrong in logic")
  console.log(collectionMemory)
  return 504
}

function cleanCollection(){
  console.log(collectionMemory)

  let tempWidths = []
  let tempHeights = []

  for(let i = 0; i < collectionMemory.widths.length; i++){
    for(let j = 0; j < collectionMemory.widths[i].length; j++){
      tempWidths.push(collectionMemory.widths[i][j])
      tempHeights.push(collectionMemory.heights[i][j])
    }
  }

  collectionMemory.widths = tempWidths
  collectionMemory.heights = tempHeights
  tempWidths = undefined
  tempHeights = undefined
  delete tempWidths
  delete tempHeights

  let tempGallery = []

  for(let i = collectionMemory.gallery.length -1; i > 0; i--){
    tempGallery.push(collectionMemory.gallery[i])
  }

  collectionMemory.gallery = tempGallery
  tempGallery = undefined
  delete tempGallery

  collectionMemory = {
    widths: collectionMemory.widths,
    heights: collectionMemory.heights,
    gallery: collectionMemory.gallery
  }

  console.log(collectionMemory)
  return
}


/* to do
  Setup heights in all alternating but still flat when I need for w(6)
  make everything absolute (track heights from last ?)
  infinity scroll loading
*/


function insertImages(){
  for(let i = 0; i < collectionMemory.gallery.length; i++){
    const imageContainer = createGalleryElement('div',{loading: "lazy", style: "width: " + collectionMemory.widths[i] + "%; height: " + collectionMemory.heights[i] + "vh;"},"imageWrapper m-0 p-1 mb-1")
    domContainer.appendChild(imageContainer)
    const image = createGalleryElement('img',{src:collectionMemory.gallery[i].Path},"img-thumbnail")
    imageContainer.appendChild(image)
  }
}
