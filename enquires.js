let disabledDates = ["2023-09-10", "2023-09-15", "2023-09-20"]

flatpickr(".flatpickr", { 
    //'inline' : true,
    altInput: true,
    altFormat: "F j, Y, H:i",
    defaultDate: new Date().fp_incr(3),
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: new Date().fp_incr(3),
    maxDate: new Date().fp_incr(186),
    disable: disabledDates,
    minTime: "8:00",
    maxTime: "18:00",
    defaultHour: 12,
    defaultMinute: 0,
    minuteIncrement: 15,
    disableMobile: false,
});

function getMainHeaders(){
    let mainHeadings;
    fetch('/api/getMainHeaders',{
        method: 'POST',
    })
    .then(response => {
        response.json().then(data =>{
            mainHeadings = data
            for(let i = 0; i < mainHeadings.length; i++){
                tempFlavs = mainHeadings[i].Flavours.split(",")
                let flavours = [];
                for(let j = 0; j < tempFlavs.length; j++){
                    flavours.push(tempFlavs[j].replace("[","").replace("]","").replace('"',"").replace('"',"").replace(" ",""))
                }
                createHeaders(mainHeadings[i].Type, "mainHeader", flavours, true, mainHeadings[i].minOrder);
            }
        })
    })
}
function getTreatsHeaders(){
    let treatsHeadings;
    fetch('/api/getTreatsHeaders',{
        method: 'POST',
    })
    .then(response => {
        response.json().then(data =>{
            treatsHeadings = data
            for(let i = 0; i < treatsHeadings.length; i++){
                createHeaders(treatsHeadings[i].Type, "subHeader", "", false, treatsHeadings[i].minOrder);
            }
        })
    })
}
getMainHeaders();
getTreatsHeaders();

/*-------------------------------------------------*/

function createHeaders(item, heading, flavours, includeFlavours, minOrder){
    const header = document.getElementById(heading);
    const div = document.createElement('div');
    const input = document.createElement('input');
    const label = document.createElement('label');

    div.className = (item);
    div.setAttribute("id", item)
    header.appendChild(div);

    input.className = ("form-check-input");
    input.setAttribute("type", "checkbox");
    if(includeFlavours === false){
        input.setAttribute("onclick", "updatePlaceholder('"+ item + "CheckBox')");
    }
    input.setAttribute("value", "");
    input.setAttribute("id", item + "CheckBox");
    div.appendChild(input);

    label.className = ("form-check-label mx-1 px-1");
    label.setAttribute("for", item + "CheckBox");
    label.innerHTML = item;
    div.appendChild(label);

    if(includeFlavours === true){
        for(let i = 0; i < flavours.length; i++){
            flavourHeaders(item, flavours[i], minOrder);
        }
    } else {
        const inputSecond = document.createElement('input');

        inputSecond.className = ("form-control mt-1 p-1 incrementalNumberBoxStyle d-inline-flex");
        inputSecond.setAttribute("type", "number");
        inputSecond.setAttribute("id", item + "CheckBox1");
        inputSecond.setAttribute("for", item + "CheckBox");
        inputSecond.setAttribute("placeholder", "0");

        inputSecond.setAttribute("min", minOrder);
        inputSecond.disabled = true;
        div.appendChild(inputSecond);
    }
};

function flavourHeaders(item, flavs, minOrder){
    const header = document.getElementById(item);
    const div = document.createElement('div');
    const input = document.createElement('input');
    const label = document.createElement('label');
    const inputSecond = document.createElement('input');

    div.className = ("Flavours " + flavs);
    header.appendChild(div);

    input.className = ("form-check-input ms-4");
    input.setAttribute("type", "checkbox");
    input.setAttribute("onclick", "updatePlaceholder('"+ item + flavs + "CheckBox')");
    input.setAttribute("value", "");
    input.setAttribute("id",item + flavs + "CheckBox");
    div.appendChild(input);

    label.className = ("form-check-label mx-1 px-1");
    label.setAttribute("for",item + flavs + "CheckBox");
    label.innerHTML = flavs;
    div.appendChild(label);

    inputSecond.className = ("form-control mt-1 p-1 incrementalNumberBoxStyle d-inline-flex");
    inputSecond.setAttribute("type", "number");
    inputSecond.setAttribute("id", item + flavs + "CheckBox1");
    inputSecond.setAttribute("for", item + flavs + "CheckBox");
    inputSecond.setAttribute("placeholder", "0");
    inputSecond.setAttribute("min", minOrder);
    inputSecond.disabled = true;
    div.appendChild(inputSecond);
}

/* Disable and enable quantity */
function updatePlaceholder(id) {
    const incrementCheckBox = document.getElementById(id + "1");

    if (document.getElementById(id).checked) {
        incrementCheckBox.setAttribute("placeholder", incrementCheckBox.min);
        incrementCheckBox.value = incrementCheckBox.min;
        incrementCheckBox.disabled = false;
    } else {
        incrementCheckBox.setAttribute("placeholder", "0");
        incrementCheckBox.value = "";
        incrementCheckBox.disabled = true;
    }
}

/* Submitting enquires */
const form = document.getElementById("form");
form.addEventListener("submit", submitEnquire);

function submitEnquire(file){
    file.preventDefault();
    const files = document.getElementById("files");
    const form = document.getElementById('form').querySelectorAll('*');
    const formData = new FormData();
    for(let i=2; i < form.length; i++){
        if(form[i].id != "" && form[i].id != "files" && form[i].id != "mainHeader" && form[i].id != "subHeader" && form[i].value !== "" && form[i].value !== undefined){
                console.log(form[i].id + " " + form[i].value);
                formData.append(form[i].id, document.getElementById(form[i].id).value);
        }
    }
   
    for(let i = 0; i < files.files.length; i++) {
            formData.append("clientPhotos", files.files[i]);
    }
    
    fetch('/api/submitEnquire', {
      method: 'POST',
      body: formData,
    })
    .then((res) => {
        if(res.status === 200){
            window.location.href = "/enquiresty.html";
        } else {
            console.log(res);
        }
    });            
};