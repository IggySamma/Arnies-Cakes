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

function submitEnquire(file){
    file.preventDefault();
    const files = document.getElementById("files");
    const formData = new FormData();
    formData.append('name', document.getElementById("fullNameInput").value);
    formData.append('email', document.getElementById("emailInput").value);
    formData.append('dateNtime', document.getElementById("datetime").value);
    formData.append('cakeQuantity', document.getElementById("cakeCheckBox1").value);
    formData.append('cakepopsQuantity', document.getElementById("cakepopsCheckBox1").value);
    formData.append('cakesiclesQuantity', document.getElementById("cakesiclesCheckBox1").value);
    formData.append('cupcakesQuantity', document.getElementById("cupcakesCheckBox1").value);
    formData.append('tdHeartQuantity', document.getElementById("3dheartCheckBox1").value);
    formData.append('chocolateStrawberryQuantity', document.getElementById("chocolateStrawberryCheckBox1").value);
    formData.append('giftboxQuantity', document.getElementById("giftBoxCheckBox1").value);
    formData.append('profiterolesQuantity', document.getElementById("profiterolesCheckBox1").value);
    formData.append('enquire', document.getElementById("enquireInput").value);
    for(let i = 0; i < files.files.length; i++) {
            formData.append("clientPhotos", files.files[i]);
    }
    /* Checking in console if forms added correctly
    for(var pair of formData.entries()) {
        console.log(pair[0]+', '+pair[1]);
    }*/
    
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