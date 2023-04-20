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