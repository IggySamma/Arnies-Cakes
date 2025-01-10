let fpDate = false;
let fpEvent = false;

(function () {
    "use strict";
    var form = document.getElementById("form");

    form.addEventListener("submit", function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    });
  })();

function loadCalender(){
    fetch('/api/disabledDates', {
        method: 'POST'
    })
    .then(response => {
        response.json().then(data =>{
            /*console.log(data)*/
            var flatpickrDate = document.getElementById("datetimeDate");
            var flatpickrEvent = document.getElementById("datetimeEvent");
            var flatpickrEvents = document.getElementsByClassName("flatpickrEvent")

            flatpickrDate.flatpickr(/*".flatpickrDate", */{ 
                //'inline' : true,
                altInput: true,
                altFormat: "F j, Y",
                allowInput: false,
                defaultDate: data.MinDate,
                enableTime: false,
                dateFormat: "Y-m-d",
                minDate: data.MinDate,
                maxDate: new Date().fp_incr(186),
                disable: data.Date,
                disableMobile: false,
                plugins: [new confirmDatePlugin({})],
                onClose: ()=> {fpDate = true},
                onChange: function(selectedDate, dateStr, instance){
                    const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                    //console.log("selectDate: " + selectedDate+ " Date: " + new Date(dateStr.split(' ', 1)).fp_incr(1))

                    const col = document.getElementById("Collection")
                    const del = document.getElementById("Delivery")
                    
                    col.removeAttribute("disabled")
                    del.removeAttribute("disabled")

                    flatpickrEvent.flatpickr(/*".flatpickrEvent", */{ 
                        //'inline' : true,
                        altInput: true,
                        altFormat: "F j, Y, H:i",
                        //altFormat: "Y-m-d, H:i",
                        allowInput: false,
                        defaultDate: new Date(dateStr.split(' ', 1)) + ", 12:00",
                        enableTime: true,
                        dateFormat: "Y-m-d, H:i",
                        minDate: new Date(dateStr.split(' ', 1)).fp_incr(-2),
                        maxDate: new Date(dateStr.split(' ', 1)).fp_incr(1),
                        /*disable: new Date(dateStr.split(' ', 1)).fp_incr(1),*/
                        enable: [new Date(dateStr.split(' ', 1)).fp_incr(-2), new Date(dateStr.split(' ', 1)).fp_incr(-1), new Date(dateStr.split(' ', 1))],
                        minTime: "10:00",
                        maxTime: "20:00",
                        defaultHour: 12,
                        defaultMinute: 0,
                        minuteIncrement: 15,
                        disableMobile: false,
                        plugins: [new confirmDatePlugin({})],
                        onClose: ()=> {fpEvent = true},
                    });

                    flatpickrEvents[0].value = dateStr.split(' ', 1) + ", 12:00";
                    /*flatpickrEvents[1].max = dateStr.split(' ', 1);*/
                    flatpickrEvents[1].value =formattedDate + ", 12:00";
                    //flatpickrEvents[2].value = formattedDate + ", 12:00";

                }
            });
            flatpickrEvent.flatpickr(/*".flatpickrEvent", */{ 
                //'inline' : true,
                altInput: true,
                altFormat: "F j, Y, H:i",
                allowInput: false,
                defaultDate: data.MinDate + " 12:00",
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                minDate: data.MinDate,
                maxDate: new Date().fp_incr(186),
                disable: data.Date,
                minTime: "10:00",
                maxTime: "18:00",
                defaultHour: 12,
                defaultMinute: 0,
                minuteIncrement: 15,
                disableMobile: false,
                plugins: [new confirmDatePlugin({})]
            });
        })
    })
}

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

loadCalender();
getMainHeaders();
getTreatsHeaders();

/*-------------------------------------------------*/

function createHeaders(item, heading, flavours, includeFlavours, minOrder) {
    const header = document.getElementById(heading);

    const div = createElement("div", { id: item }, `${item} itemWrapper`);
    header.appendChild(div);

    const input = createElement("input", {
        type: "checkbox",
        id: `${item}CheckBox`,
        value: "",
        onclick: includeFlavours ? `updatePlaceholder('')` : `updatePlaceholder('${item}')`,
        required: ""
    }, "form-check-input CheckBox");
    div.appendChild(input);

    const label = createElement("label", {
        for: `${item}CheckBox`
    }, "form-check-label mx-1 px-1", item);
    div.appendChild(label);

    if (includeFlavours) {
        flavours.forEach(flavour => flavourHeaders(item, flavour, minOrder));
    } else {
        const inputSecond = createElement("input", {
            type: "number",
            id: `${item}CheckBox1`,
            for: `${item}CheckBox`,
            placeholder: "0",
            min: minOrder,
            disabled: true
        }, "form-control m-1 p-1 incrementalNumberBoxStyle d-inline-flex");
        div.appendChild(inputSecond);
    }
}

function flavourHeaders(item, flavs, minOrder) {
    const header = document.getElementById(item);

    const div = createElement("div", {}, `Flavours ${flavs}`);
    header.appendChild(div);


    const input = createElement("input", {
        type: "checkbox",
        id: `${item}${flavs}CheckBox`,
        value: "",
        onclick: `updatePlaceholder('${item}${flavs}')`,
        required: ""
    }, "form-check-input ms-4");
    div.appendChild(input);

    const label = createElement("label", {
        for: `${item}${flavs}CheckBox`
    }, "form-check-label mx-1 px-1", flavs);
    div.appendChild(label);

    const inputSecond = createElement("input", {
        type: "number",
        id: `${item}${flavs}CheckBox1`,
        for: `${item}${flavs}CheckBox`,
        placeholder: "0",
        min: minOrder,
        disabled: true
    }, "form-control m-1 p-1 incrementalNumberBoxStyle d-inline-flex");

    if (item == "Cake") {
        const nDiv = createElement("div", {}, `btn-group cakeSizes`);
        div.appendChild(nDiv);
    
        const select = createElement("select", {"id": `${item}${flavs}CakeSize`, "disabled": "", "required":"", "style":"display: none;"}, `form-select cakeSizes m-1 p-1 pb-1 ms-4`);
        nDiv.appendChild(select);
    
        const sizes = [
            {value: "4", text: "4 inch (Round cake) - Feeds 4-6 People"},
            {value: "6", text: "6 inch (Round cake) - Feeds 14 People"},
            {value: "8", text: "8 inch (Round cake) - Feeds 24 People - Standard Size"},
            {value: "10", text: "10 inch (Square cake) - Feeds 50 People"},
        ]
    
        defaultSelect = createElement("option", {"value": "", "selected":"", "disabled":"", "min":"4", "max":"10"}, "", "Please select cake size");
        select.appendChild(defaultSelect);
    
        sizes.forEach(size => {
            const a = createElement("option", {"value": size.value}, "", size.text);
            select.appendChild(a);
        })
    } 

    div.appendChild(inputSecond);
}

function enableDisable(id){
    const box = document.getElementById(id);
    if (box.disabled == false) {
        box.disabled = true; 
        box.removeAttribute("required")
    } else {
        box.disabled = false;
        box.setAttribute("required","")
    }

    id == "AllergyNo" ? document.getElementById("AllergyInput").setAttribute("required", ""):document.getElementById("AllergyInput").removeAttribute("required")

    if (id == "Collection") {
        if (box.disabled == true){
            document.getElementById("colDel").innerHTML = 'Delivery of order date & time:';
        } else {
            document.getElementById("colDel").innerHTML = '';
        }
    } else if (id == "Delivery") {
        if (box.disabled == true){
            document.getElementById("colDel").innerHTML = 'Collection of order date & time:';
        } else {
            document.getElementById("colDel").innerHTML = '';
        }
    }
}

/* Disable and enable quantity */
function updatePlaceholder(id) {
    const incrementCheckBox = document.getElementById(id + "CheckBox1");
    const cakeSize = document.getElementById(id+"CakeSize");
    const check = document.querySelectorAll("[id$='CheckBox']");
    const flavours = document.querySelectorAll("[class^='Flavours']");

    //console.log(check)
    if (id != '') {
        //console.log(cakeSize)
        if (document.getElementById(id + "CheckBox").checked) {
            incrementCheckBox.setAttribute("placeholder", incrementCheckBox.min);
            incrementCheckBox.value = incrementCheckBox.min;
            incrementCheckBox.disabled = false;
            if (cakeSize != null){
                cakeSize.disabled = false;
                cakeSize.style.display = "block";
            }
        } else {
            incrementCheckBox.setAttribute("placeholder", "0");
            incrementCheckBox.value = "";
            incrementCheckBox.disabled = true;
            if (cakeSize != null){
                cakeSize.value = "";
                cakeSize.disabled = true;
                cakeSize.style.display = "none";
            }

        }
    } else {
        flavours.forEach( item => {
            if(item.firstElementChild.checked == true && item.parentElement.firstElementChild.checked == false){
                item.firstElementChild.checked = false;
                updatePlaceholder(item.firstElementChild.id.replace("CheckBox",""));
            }
        })
    }

    var counter = 0;


    check.forEach(item => {
        //Need to add additional logic if additional item with flavours is checked
        /*if (item.parentElement.className.startsWith("Flavours") && item.parentElement.parentElement.firstElementChild.checked == true){
            item.checked? counter++ : counter--;
        } else*/ if (item.parentElement.parentElement.id != "mainHeader" ){
            item.checked? counter++ : "";
        }
    })

    if (counter > 0) {
        check.forEach(item => { item.removeAttribute("required") })
    } else {
        check.forEach(item => { item.setAttribute("required","") })
    }
}




/* Submitting enquires */
const form = document.getElementById("form");
form.addEventListener("submit", submitEnquire);


function submitEnquire(file){
    file.preventDefault();
    document.getElementById("submit").disabled = true;
    
    const formData = new FormData();
    let errors = false;

    try {
        validation(formData);
    } catch (error) {
        errors = true;
        if (error.focus == "datetimeDate" || error.focus == "datetimeEvent") {
            document.getElementById(error.focus).nextElementSibling.focus();  
        } else {
            document.getElementById(error.focus).focus();
        }
        alert(error);
    } finally {
        document.getElementById("submit").disabled = false;
    }
   
    if (!errors) {
/*
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
*/
        fetch('/api/submitEnquire', {
            method: 'POST',
            body: formData,
        })
        .then((res) => {
            res.status === 405 ? alert("Email provided is invalid") :
            res.status === 406 ? alert("Mobile number is invalid") :
            res.status === 407 ? alert("Incorrect file attached. Only .Png, .Jpg, .Jpeg allowed") :
            res.status === 500 ? alert("Something went wrong, please check file is .Png | .Jpg | .Jpeg format. Otherwise please contact us on our social links instead") :
            res.status === 200 ? window.location.href = "/enquiresty.html" : 
            document.getElementById("submit").disabled = false;
        });
    }

    //document.getElementById("submit").disabled = false; //debugging
};

function validation(formData){
    const name = document.getElementById("fullNameInput");
    const email = document.getElementById("emailInput");
    const number = document.getElementById("numberInput");
    const date = document.getElementById("datetimeDate");
    const collection = document.getElementById("Collection");
    const delivery = document.getElementById("Delivery");
    const event = document.getElementById("datetimeEvent");
    const order = document.querySelectorAll("[id$='CheckBox']");
    const cakeSize = document.querySelectorAll("[id$='CakeSize']");
    const message = document.getElementById("EnquireInput");
    const allergyYes = document.getElementById("AllergyYes");
    const allergyNo = document.getElementById("AllergyNo");
    const allergyMessage = document.getElementById("AllergyInput");
    const photo = document.getElementById("files");

    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegEx = /^(?:08\d{8}|\+3538\d{8})$/;

    if (name.value == ""){
        const error = new Error("Name field is empty, please enter your name.");
        error.focus = "fullNameInput";
        throw error;
    } else {
        formData.append("Name", name.value);
    }

    if (email.value == "") {
        const error = new Error("Email field is empty, please enter your email.");
        error.focus = "emailInput";
        throw error;
    } else if (email.value.match(emailRegEx) == false) {
        const error = new Error("Email seems to be entered incorrect, please check again.");
        error.focus = "email";
        throw error;
    } else {
        formData.append("Email", email.value);
    }

    if (number.value == "") {
        const error = new Error("Number field is empty, please enter your phone numbers.");
        error.focus = "numberInput";
        throw error;
    } else if (number.value.match(phoneRegEx) == false) {
        const error = new Error("Phone number seems to be incorrect, please check again.");
        error.focus = "number";
        throw error;
    } else {
        formData.append("Number", number.value);
    }

    if (fpDate == false) {
        const error = new Error("Please select date for your event.");
        error.focus = "datetimeDate";
        throw error;
    }

    if (collection.checked == false && delivery.checked == false) {
        const error = new Error("Please select either collection or delivery as an option");
        error.focus = "Collection";
        throw error;
    } else if (collection.checked == true){
        formData.append("Date of Event", date.value);
        formData.append("Collection", "Yes");
        formData.append("Date of collection", event.value);
    } else if (delivery.checked == true) {
        formData.append("Date of Event", date.value);
        formData.append("Delivery", "Yes");
        formData.append("Date of delivery", event.value);
    }
    
    if (collection.checked == true && fpEvent == false) {
        const error = new Error("Please select the collection date.")
        error.focus = "datetimeEvent";
        throw error;
    } else if (delivery.checked == true && fpEvent == false) {
        const error = new Error("Please select the delivery date.")
        error.focus = "datetimeEvent";
        throw error;
    }

    var counter = 0;

    cakeSize.forEach(item => {
        if(item.disabled == false && item.value == ""){
            const error = new Error("Please select a cake szie.");        
            error.focus = item.id;
            throw error;
            
        } else if (item.disabled == false && item.value != ""){
            counter++;
            var obj = {
                "Item": "Cake",
                "Flavour": item.parentElement.previousElementSibling.innerHTML,
                "Cake Size": item.value,
                "Quantity": item.parentElement.lastElementChild.value
            }
            formData.append("Order", JSON.stringify(obj))
        }
    })

    order.forEach(item => {
        if (item.parentElement.parentElement.id != "mainHeader"  && !(item.id.startsWith("Cake")) && item.parentElement.className.startsWith("Flavours") && item.checked == true){
            counter++;
            console.log("test")
            var obj = {
                "Item": item.parentElement.parentElement.id,
                "Flavour": item.nextElementSibling.innerHTML,
                "Quantity": document.getElementById(item.id+1).value
            }
            formData.append("Order", JSON.stringify(obj))

        } else if (item.parentElement.parentElement.id != "mainHeader" && !(item.id.startsWith("Cake")) && item.checked == true) {
            counter++;
            var obj = {
                "Item": item.nextElementSibling.innerHTML,
                "Quantity": document.getElementById(item.id+1).value
            }
            formData.append("Order", JSON.stringify(obj))
        }
    })


    if (counter == 0) {
        const error = new Error("Please select the type of item you'd like to enquire about.");
        error.focus = "CakeCheckBox";
        throw error;
    }

    if (message.value == "") {
        const error = new Error("Please give me some details about the items you'd like to order.");
        error.focus = "EnquireInput";
        throw error;
    } else {
        formData.append("Message", message.value);
    }

    if (allergyNo.checked == false && allergyYes.checked == false) {
        const error = new Error("Please let me know if there's any allergies I should be aware of.");
        error.focus = "AllergyNo";
        throw error;
    }

    if (allergyYes.checked == true && allergyMessage == "") {
        const error = new Error("Please let me know of what allergies I should be aware of.");
        error.focus = "AllergyYes";
        throw error;
    } else if (allergyNo.checked == true){
        formData.append("Allergies", "No");
    } else {
        formData.append("Allergies", "Yes!");
        formData.append("Allergies Information", allergyMessage.value);
    }

    if (photo.value == ""){
        const error = new Error("Please attach example of designs you'd like for your order.");
        error.focus = "files";
        throw error;
    } else {
        for (let i = 0; i < photo.files.length; i++) {
            const file = photo.files[i];
            const validTypes = ["image/png", "image/jpeg", "image/jpg"];
            if (!validTypes.includes(file.type)) {
                throw new Error("Please upload a file with .png, .jpg, or .jpeg format.");
            }
            formData.append("clientPhotos", file);
        }
    }
}
