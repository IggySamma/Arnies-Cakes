function showDiv() {
  const current = document.getElementById('select-box');
  console.log(current.value);
  const displayAll = document.getElementById('Gallery');
  if (current.value === 'All' ) {
    displayAll.style.visibility = 'visible';
  } else {
    displayAll.style.visibility = 'hidden';   
  }

}

var urlParams = new URLSearchParams(window.location.search);
var sectionName = urlParams.get('type');
const select = document.getElementById('select-box');
select.value = sectionName;