/* Setting todays date +3 for datetime-local selection ----**Create dynamic adjusting dates to block them off**---- */
const date = new Date();
const minDate = new Date().setDate(date.getDate() + 3);
document.getElementById("datetime").min = new Date(minDate).toISOString().slice(0, 16);
document.getElementById("datetime").defaultValue = new Date(minDate).toISOString().slice(0, 16);

/* Temp before creating database for editing */

const mainHeadings = {
    Cake: {
        Flavours: ["Vanilla", "Chocolate", "Raffaello", "Honey", "Black Forest", "Napoleon", "Lemon", "Fresh Fruit"],
        Placeholder: "1",
    },
    Cakepops: {
        Flavours: ["Vanilla", "Chocolate", "Raffaello", "Honey", "Black Forest", "Lemon", "Fresh Fruit"],
        Placeholder: "6",
    },
    Cakesicles: {
        Flavours: ["Vanilla", "Chocolate", "Raffaello", "Honey", "Black Forest", "Lemon", "Fresh Fruit"],
        Placeholder: "6",
    },
    Cupcakes: {
        Flavours: ["Vanilla", "Chocolate", "Raffaello", "Honey", "Black Forest", "Lemon", "Fresh Fruit"],
        Placeholder: "6",
    },
};

const treatsHeadings = {
    "3d Chocolate Heart": {
        Placeholder: "1",
    },
    "Chocolate Strawberries": {
        Placeholder: "6",
    },
    "Gift Box": {
        Placeholder: "1",
    },
    "Profiterole bags": {
        Placeholder: "3",
    },
};

/*---------------------------------------------------*/


/* Creating Dynamic headers */
Object.keys(mainHeadings).forEach((item) => createHeaders(item, "mainHeader", true));
Object.keys(treatsHeadings).forEach((item) => createHeaders(item, "subHeader", false));


function createHeaders(item, heading, includeFlavours){
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
        Object.values(mainHeadings[item].Flavours).forEach((flavs) => flavourHeaders(item, flavs));
    } else {
        const inputSecond = document.createElement('input');

        inputSecond.className = ("form-control mt-1 p-1 incrementalNumberBoxStyle d-inline-flex");
        inputSecond.setAttribute("type", "number");
        inputSecond.setAttribute("id", item + "CheckBox1");
        inputSecond.setAttribute("for", item + "CheckBox");
        inputSecond.setAttribute("placeholder", "0");

        inputSecond.setAttribute("min", Object.values(treatsHeadings[item].Placeholder));
        inputSecond.disabled = true;
        div.appendChild(inputSecond);
    }
};

function flavourHeaders(item, flavs){
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
    inputSecond.setAttribute("min", Object.values(mainHeadings[item].Placeholder));
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
        incrementCheckBox.value = "0";
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