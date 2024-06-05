let urlParams = new URLSearchParams(window.location.search);
let sectionName = urlParams.get('type');
let domContainer = document.getElementById("galleryContainer");

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
        buildCollection(res.data.reverse())
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
/*
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
]*/

let widths = [
  10,
  20,
  30,
  40,
  50,
  60,
  70,
  80,
  90,
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
    0:[w(2),w(2),w(2),w(2),w(2)],
    1:[w(2),w(4),w(2),w(2)],
    2:[w(2),w(2),w(2),w(2),w(2)],
    3:[w(2),w(2),w(4),w(2)],
}

let heightsCollection = {
  0:[h(10),h(11),h(9),h(10),h(11)],
  1:[h(10),h(16),h(11),h(9)],
  2:[h(11),h(9),h(10),h(9),h(11)],
  3:[h(10),h(9),h(16),h(11)],
}


function randomSelect(min, max){
  return Math.floor(Math.random() * (max - min) + min);
}

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

function createMasonry(){
  return masonry = new Masonry( '.galleryWrapper', {
          columnWidth: '.widthHelper', 
          itemSelector: '.imageWrapper',
          percentPosition: true,
          gutter: 0,  
        })
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
    cleanCollection()

    imagesLoaded(document.querySelectorAll('.imageWrapper'),createMasonry())

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
    //collectionMemory.previous = 0 // Temp testing
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
  let count = 0
  
  for(let i = 0; i < collectionMemory.widths.length; i++){
    for(let j = 0; j < collectionMemory.widths[i].length; j++){
      if(count !== collectionMemory.gallery.length){
        insertImages(collectionMemory.widths[i][j], collectionMemory.heights[i][j], collectionMemory.gallery[count])
        count = count + 1  
      }
    }
  }
  return
}

function insertImages(widths, heights, gallery){
    const imageContainer = createGalleryElement(
      'div', {loading: "lazy"}
      ,"imageWrapper Type:" + gallery.Type + " ID:" + gallery.ID + " w" + mobileWidths(widths) + " d-w" + widths + " vph" + (heights-10) + " d-vph" + heights + " m-0 p-1 mb-1")
    domContainer.appendChild(imageContainer)
    const image = createGalleryElement('img',{src:gallery.Path},"img-thumbnail")
    imageContainer.appendChild(image)
    console.log(gallery)
}

function mobileWidths(widths){
  if(widths <= 20){
    return 50
  } else {
    return 100
  }
}