var urlParams = new URLSearchParams(window.location.search);
var sectionName = urlParams.get('type');
const select = document.getElementById('select-box');
select.value = sectionName;

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

function showToolTipDiv(id, className) {
  const selectToolTipDiv = document.getElementById(className);
  const Div1 = document.getElementsByClassName('toolTip1');
  const Div2 = document.getElementsByClassName('toolTip2');
  const toolTipMap = new Map([
    ['raffaello', './Index Images/Main Cake 1.jpg'],
    ['honey', './Index Images/Main Cake 2.jpg'],
    ['napoleon', './Index Images/Main Cake 3.jpg'],
    ['strawberries', './Index Images/Main Cake 1.jpg'],
    ['3d', './Index Images/Main Cake 2.jpg'],
    ['giftBox', './Index Images/Main Cake 3.jpg'],
    ['cakePops', './Index Images/Main Cake 1.jpg'],
    ['cakeSicles', './Index Images/Main Cake 2.jpg'],
  ]);

  if (className === 'tt1') {
      for(i = 0; i < Div1.length; i++) {
      Div1[i].style.display = 'flex';
      selectToolTipDiv.src = toolTipMap.get(id);
    }
  } else if (className === 'tt2') {
    for(i = 0; i < Div2.length; i++) {
      Div2[i].style.display = 'flex';
      selectToolTipDiv.src = toolTipMap.get(id);
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
