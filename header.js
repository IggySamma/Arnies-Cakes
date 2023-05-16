var urlParams = new URLSearchParams(window.location.search);
var sectionName = urlParams.get('type');
const select = document.getElementById('select-box');
select.value = sectionName;

function getGallery(){
  let array = [];
  let temp = '';
  fetch('/api/gallery', {
    method: 'POST', 
    body: sectionName,
  })
  .then(response => 
    response.json().then(data => ({
        data: data,
        status: response.status
    }))
    .then(res => {
      array = res.data;
      console.log(array);
    for (let i = 1; i <= res.data.length; i++){
      temp = res.data.find(item => item.ID === i);
      console.log(temp.Path);
      showGallery(temp.Type, temp.Path);
    }}))
}

function showGallery(Type, Path){
  const domGalllery = document.getElementById('Gallery');
  const divContainer = document.createElement('div');
  const imgPath = document.createElement('img');
  divContainer.className = (Type + " col m-2 p-3");
  divContainer.setAttribute("data-bs-toggle", "modal");
  divContainer.setAttribute("data-bs-target", "#modalImages");
  domGalllery.appendChild(divContainer);
  imgPath.className = ("img-thumbnail");
  imgPath.src = Path
  divContainer.appendChild(imgPath);
  }

function showToolTipDiv(id, className) {
  const selectToolTipDiv = document.getElementById(className);
  const Div1 = document.getElementsByClassName('toolTip1');
  const Div2 = document.getElementsByClassName('toolTip2');
  const toolTipMap = new Map([
    ['honey', './Flavours Images/honey cake.jpg'],
    ['napoleon', './Flavours Images/napoleon.jpeg'],
    ['3d', './Flavours Images/3d heart.jpg'],
    ['giftBox', './Flavours Images/giftbox.jpg'],
    ['cakePops', './Flavours Images/cakepops.jpg'],
    ['cakeSicles', './Flavours Images/cakesicles.jpg'],
    ['plikyti', './Flavours Images/plikyti.jpg'],
  ]);

  if (className === 'tt1') {
      for(i = 0; i < Div1.length; i++) {
      selectToolTipDiv.src = toolTipMap.get(id);
      Div1[i].style.display = 'flex';
    }
  } else if (className === 'tt2') {
    for(i = 0; i < Div2.length; i++) {
      selectToolTipDiv.src = toolTipMap.get(id);
      Div2[i].style.display = 'flex';
      if (id === '3d') {
        Div2[i].style.height = '300px';
        Div2[i].style.width = '350px';
        Div2[i].style.right = '10vw';
        Div2[i].style.top = '10%';
      } else {
        Div2[i].style.height = '350px';
        Div2[i].style.width = '250px';
        Div2[i].style.right = '15vw';
        Div2[i].style.top = '5%';
      }
    }
  }
}

function clearTipDiv() {
  const Div1 = document.getElementsByClassName('toolTip1');
  const Div2 = document.getElementsByClassName('toolTip2');
  for(i = 0; i < Div1.length; i++) {
    Div1[0].style.display = 'none';
  }
  for(i = 0; i < Div2.length; i++) {
    Div2[0].style.display = 'none';
  }
}


function showDiv() {
  const currentSelection = document.getElementById('select-box');
  const selectCakes = document.getElementsByClassName('Cakes');
  const selectTreats = document.getElementsByClassName('Treats');
  const selectGifts = document.getElementsByClassName('Gifts');

if (currentSelection.value === 'All') {
    for (i = 0; i < selectCakes.length; i++) {
      selectCakes[i].style.display = 'flex';
    }
    for (i = 0; i < selectTreats.length; i++) {
      selectTreats[i].style.display = 'flex';
    }
    for (i = 0; i < selectGifts.length; i++) {
      selectGifts[i].style.display = 'flex';
    }
} else if (currentSelection.value === 'Cakes') {
    for (i = 0; i < selectCakes.length; i++) {
      selectCakes[i].style.display = 'flex';
    }
    for (i = 0; i < selectTreats.length; i++) {
      selectTreats[i].style.display = 'none';
    }
    for (i = 0; i < selectGifts.length; i++) {
      selectGifts[i].style.display = 'none';
    }
} else if (currentSelection.value === 'Treats') {
    for (i = 0; i < selectCakes.length; i++) {
      selectCakes[i].style.display = 'none';
    }
    for (i = 0; i < selectTreats.length; i++) {
      selectTreats[i].style.display = 'flex';
    }
    for (i = 0; i < selectGifts.length; i++) {
      selectGifts[i].style.display = 'none';
    }
} else if (currentSelection.value === 'Gifts') {
    for (i = 0; i < selectCakes.length; i++) {
      selectCakes[i].style.display = 'none';
    }
    for (i = 0; i < selectTreats.length; i++) {
      selectTreats[i].style.display = 'none';
    }
    for (i = 0; i < selectGifts.length; i++) {
      selectGifts[i].style.display = 'flex';
    }
  }
}


