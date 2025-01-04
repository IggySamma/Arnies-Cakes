function loadCalender(){
    fetch('/api/disabledDates', {
        method: 'POST'
    })
    .then(response => {
        response.json().then(data =>{
            console.log(data)
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
                onChange: function(selectedDate, dateStr, instance){
                    const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                    console.log("selectDate: " + selectedDate+ " Date: " + new Date(dateStr.split(' ', 1)).fp_incr(1))

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
                        plugins: [new confirmDatePlugin({})]
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

function createHeaders(item, heading, flavours, includeFlavours, minOrder){
    const header = document.getElementById(heading);
    const div = document.createElement('div');
    const input = document.createElement('input');
    const label = document.createElement('label');

    div.className = (item + " itemWrapper");
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

        inputSecond.className = ("form-control m-1 p-1 incrementalNumberBoxStyle d-inline-flex");
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
    const formSelector = document.getElementById('form').querySelectorAll('*');
    const formData = new FormData();
    for(let i=2; i < formSelector.length; i++){
        if(formSelector[i].id != "" && formSelector[i].id != "files" && formSelector[i].id != "mainHeader" && formSelector[i].id != "subHeader" && formSelector[i].value !== "" && formSelector[i].value !== undefined){
                //console.log(form[i].id + " " + form[i].value);
                formData.append(formSelector[i].id, document.getElementById(formSelector[i].id).value);
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
        res.status === 405 ? alert("Email provided is invalid") :
        res.status === 406 ? alert("Mobile number is invalid") :
        res.status === 407 ? alert("Incorrect file attached. Only .Png, .Jpg, .Jpeg allowed") :
        res.status === 500 ? alert("Something went wrong, please check file is .Png | .Jpg | .Jpeg format. Otherwise please contact us on our social links instead") :
        res.status === 200 ? window.location.href = "/enquiresty.html" : 
        console.log(res);
    });       
};