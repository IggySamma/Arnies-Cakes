function updatePlaceholder(id) {
    const incrementCheckBox = document.getElementById(id + "1");
    if (document.getElementById(id).checked) {
        incrementCheckBox.setAttribute("placeholder", "1");
        incrementCheckBox.value = "1";
        incrementCheckBox.disabled = false;
    } else {
        incrementCheckBox.setAttribute("placeholder", "0");
        incrementCheckBox.value = "0";
        incrementCheckBox.disabled = true;
    }
}

const form = document.getElementById("form");
form.addEventListener("submit", submitEnquire);

function submitEnquire(prevent){
    prevent.preventDefault();
    let array = [];
    let data = {
        'fullName': document.getElementById("fullNameInput").value,
        'email': document.getElementById("emailInput").value
    };
    const formData = new FormData();
    formData.append('name', document.getElementById("fullNameInput").value);
    formData.append('email', document.getElementById("emailInput").value);

    for(var pair of formData.entries()) {
        console.log(pair[0]+', '+pair[1]);
    }
    
    fetch('/api/submitEnquire', {
      method: 'POST',

      body: formData,
    })/*,
    setTimeout(()=>{
        location.reload();
    }, "1000")
    /*.then(response => 
      response.json().then(data => ({
          data: data,
          status: response.status
      }))
      .then(res => {
        array = res.data;
      for (let i = res.data.length-1; i >= 0; i--){
        temp = res.data[i];
        /*showGallery(temp.ID, temp.Type, temp.Path);
      }}))*/
  }