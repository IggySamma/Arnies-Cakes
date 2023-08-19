/* Creating Dynamic headers */

/* Temp before creating database for editing */
const mainHeadings = [];
const treatsHeadings = [];
const flavours = [];

mainHeadings.push("Cake", "Cakepops", "Cakesicles", "Cupcakes");
treatsHeadings.push("3D Chocolate heart", "Chocolate Strawberries", "Gift Box", "Profiteroles");
flavours.push("Vanilla", "Chocolate", "Raffaello", "Honey", "Black Forest", "Napoleon", "Lemon", "Fresh Fruit")
/*---------------------------------------------------*/

mainHeadings.forEach((item) => createHeaders(item, "mainHeader"));
treatsHeadings.forEach((item) => createHeaders(item, "subHeader"));

function createHeaders(item, heading){
    const header = document.getElementById(heading);
    const div = document.createElement('div');
    const input = document.createElement('input');
    const label = document.createElement('label');
    const inputSecond = document.createElement('input');

    div.className = (item);
    header.appendChild(div);

    input.className = ("form-check-input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("onclick", "updatePlaceholder('" + item + "CheckBox')");
    input.setAttribute("value", "");
    input.setAttribute("id", item + "CheckBox");
    div.appendChild(input);

    label.className = ("form-check-label mx-1 px-1");
    label.setAttribute("for", item + "CheckBox");
    label.innerHTML = item;
    div.appendChild(label);

    inputSecond.className = ("form-control mt-1 p-1 incrementalNumberBoxStyle d-inline-flex");
    inputSecond.setAttribute("type", "number");
    inputSecond.setAttribute("id", item + "CheckBox1");
    inputSecond.setAttribute("for", item + "CheckBox");
    inputSecond.setAttribute("placeholder", "0");
    inputSecond.setAttribute("min", "0");
    inputSecond.disabled = true;
    div.appendChild(inputSecond);
};

/* Disable and enable quantity */
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

/* Setting todays date +3 for datetime-local selection ----**Create dynamic adjusting dates to block them off**---- */
const date = new Date();
const minDate = new Date().setDate(date.getDate() + 3);
document.getElementById("datetime").min = new Date(minDate).toISOString().slice(0, 16);
document.getElementById("datetime").defaultValue = new Date(minDate).toISOString().slice(0, 16);

/* Submitting enquire ----**Need to think of better way to append everything**---- */
const form = document.getElementById("form");
form.addEventListener("submit", submitEnquire);

function submitEnquire(file){
    file.preventDefault();
    const files = document.getElementById("files");
    const form = document.getElementById('form').querySelectorAll('*');
    const formData = new FormData();
    //console.log(form);
    console.log(form.length);
    for(let i=2; i < form.length; i++){
        if(form[i].id != "" && form[i].id != "files" && form[i].id != "mainHeader" && form[i].id != "subHeader"){
            if(form[i].id.value != ""){
                console.log(form[i].id);
                formData.append(form[i].id, document.getElementById(form[i].id).value);
            }
        }
    }
    console.log("-------------");
    /*
    form.forEach(collection => {
        console.log(collection.id);
        /*if(collection.id !== "files" && collection.id.value !== null) {
            formData.append(collection.id, document.getElementById(collection.id).value);
        }
    })*/
    /*
    formData.append('name', document.getElementById("fullNameInput").value);
    formData.append('email', document.getElementById("emailInput").value);
    formData.append('dateNtime', document.getElementById("datetime").value);
    formData.append('cakeQuantity', document.getElementById("CakeCheckBox1").value);
    formData.append('cakepopsQuantity', document.getElementById("CakepopsCheckBox1").value);
    formData.append('cakesiclesQuantity', document.getElementById("CakesiclesCheckBox1").value);
    formData.append('cupcakesQuantity', document.getElementById("CupcakesCheckBox1").value);
    formData.append('tdHeartQuantity', document.getElementById("3D Chocolate heartCheckBox1").value);
    formData.append('chocolateStrawberryQuantity', document.getElementById("Chocolate StrawberriesCheckBox1").value);
    formData.append('giftboxQuantity', document.getElementById("Gift BoxCheckBox1").value);
    formData.append('profiterolesQuantity', document.getElementById("ProfiterolesCheckBox1").value);
    formData.append('enquire', document.getElementById("enquireInput").value);
    */
   
    for(let i = 0; i < files.files.length; i++) {
            formData.append("clientPhotos", files.files[i]);
    }
    // Checking in console if forms added correctly
    for(var pair of formData.entries()) {
        console.log(pair[0]+', '+pair[1]);
    }
    
    fetch('/api/submitEnquire', {
      method: 'POST',
      body: formData,
    })/*
    .then((res) => {
      setTimeout(()=>{
        window.location.href = "/enquiresty.html";
    }), "2000"});*/             
};