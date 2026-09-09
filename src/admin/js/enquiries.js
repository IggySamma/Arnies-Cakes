import { show, hide } from './index.js';
import confirmDatePlugin from './confirmDate-wrapper.js';

let fpDate = false;
let fpEvent = false;


export function modalSubmit() {
   	"use strict";
    	var form = document.getElementById("form");
	var submit = document.getElementById("footerForm");

	//console.log(submit)

	submit.addEventListener("submitEnquiry", function (event) {
		event.preventDefault();
		if (!form.checkValidity()) {
			event.preventDefault();
			event.stopPropagation();
		}

		form.classList.add("was-validated");
	});
};

export function loadCalender(){
    fetch('/api/disabledDates', {
        method: 'POST'
    })
    .then(response => {
        response.json().then(data =>{
            var flatpickrDate = document.getElementById("datetimeDate");
            var flatpickrEvent = document.getElementById("datetimeEvent");
            var flatpickrEvents = document.getElementsByClassName("flatpickrEvent")

            flatpickrDate.flatpickr({ 
                altInput: true,
                altFormat: "F j, Y",
                allowInput: false,
		defaultDate: new Date().fp_incr(1),
                enableTime: false,
                dateFormat: "Y-m-d",
		minDate: new Date().fp_incr(1),
                maxDate: new Date().fp_incr(730),
                /*disable: data.Date,*/
                disableMobile: false,
                plugins: [new confirmDatePlugin({})],
                onClose: ()=> {fpDate = true},
                onChange: function(selectedDate, dateStr, instance){
                    const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                    const col = document.getElementById("Collection")
                    const del = document.getElementById("Delivery")
                    
                    col.removeAttribute("disabled")
                    del.removeAttribute("disabled")

                    flatpickrEvent.flatpickr({ 
			altInput: true,
			altFormat: "F j, Y, H:i",
			allowInput: false,
			defaultDate: new Date(dateStr.split(' ', 1)) + ", 12:00",
			enableTime: true,
			dateFormat: "Y-m-d, H:i",
			minDate: new Date().fp_incr(1),
			maxDate: new Date().fp_incr(730),
			    enable: [new Date(dateStr.split(' ', 1)).fp_incr(-3), new Date(dateStr.split(' ', 1)).fp_incr(-2), new Date(dateStr.split(' ', 1)).fp_incr(-1), new Date(dateStr.split(' ', 1)), new Date(dateStr.split(' ', 1)).fp_incr(1)],
			minTime: "00:00",
			maxTime: "23:59",
			defaultHour: 12,
			defaultMinute: 0,
			minuteIncrement: 15,
			disableMobile: false,
			plugins: [new confirmDatePlugin({})],
			onClose: ()=> {fpEvent = true},
                    });

                    flatpickrEvents[0].value = dateStr.split(' ', 1) + ", 12:00";
                    flatpickrEvents[1].value =formattedDate + ", 12:00";
                }
            });
            flatpickrEvent.flatpickr({ 
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


export function enableDisable(id){
    const box = document.getElementById(id);
    if (box.disabled == false) {
        box.disabled = true; 
        box.removeAttribute("required")
    } else {
        box.disabled = false;
        box.setAttribute("required","")
    }

    id == "AllergyNo" ? document.getElementById("AllergyInput").setAttribute("required", ""):document.getElementById("AllergyInput").removeAttribute("required");

    if (id == "Collection") {
        if (box.disabled == true){
            	document.getElementById("colDel").innerHTML = 'Delivery of order date & time:';
		document.getElementById("AddressInput").setAttribute("required", "");
		show(document.getElementById("AddressField"));
        } else {
            	document.getElementById("colDel").innerHTML = '';
		hide(document.getElementById("AddressField"));
        }
    } else if (id == "Delivery") {
        if (box.disabled == true){
            	document.getElementById("colDel").innerHTML = 'Collection of order date & time:';
		document.getElementById("AddressInput").removeAttribute("required");
		hide(document.getElementById("AddressField"));
        } else {
            	document.getElementById("colDel").innerHTML = '';
		hide(document.getElementById("AddressField"));
        }
    }
}


export function updatePlaceholder(id) {
	const incrementCheckBox = document.getElementById(id + "CheckBox1");
	const cakeSize = document.getElementById(id+"CakeSize");
	const check = document.querySelectorAll("[id$='CheckBox']");
	const flavours = document.querySelectorAll("[class^='Flavours']");

	if (id != '') {
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
		if (item.parentElement.parentElement.id != "mainHeader" ){
		item.checked? counter++ : "";
		}
	})

	if (counter > 0) {
		check.forEach(item => { item.removeAttribute("required") })
	} else {
		check.forEach(item => { item.setAttribute("required","") })
	}
}
window.updatePlaceholder = updatePlaceholder;

export function validation(formData){
	const name = document.getElementById("fullNameInput");
	const email = document.getElementById("emailInput");
	const number = document.getElementById("numberInput");
	const date = document.getElementById("datetimeDate");
	const collection = document.getElementById("Collection");
	const delivery = document.getElementById("Delivery");
	const event = document.getElementById("datetimeEvent");
	const order = document.querySelectorAll("[id$='CheckBox']");
	const cakeSize = document.querySelectorAll("[id$='CakeSize']");
	const message = document.getElementById("EnquirieInput");
	const allergyYes = document.getElementById("AllergyYes");
	const allergyNo = document.getElementById("AllergyNo");
	const allergyMessage = document.getElementById("AllergyInput");
	const address = document.getElementById("AddressInput");
	const fullPrice = document.getElementById("fullPrice");
	const paidFull = document.getElementById("paidFull");
	const paidDeposit = document.getElementById("paidDeposit");
	const paidNone = document.getElementById("paidNone");
	const depositPaid = document.getElementById("depositPaid");
	let cakeQuantity = 0;

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
		error.focus = "numberInput";
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
		if (address.value == "") {
			const error = new Error("Please enter delivery address or eircode");
			error.focus = "AddressInput";
			throw error;
		} else {
			formData.append("Date of Event", date.value);
			formData.append("Delivery", "Yes");
			formData.append("Date of delivery", event.value);
			formData.append("Address", address.value);
		}

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
		let obj = {
			"Item": "Cake",
			"Flavour": item.parentElement.previousElementSibling.innerHTML,
			"Cake Size": item.value,
			"Quantity": item.parentElement.parentElement.lastElementChild.value
		}
		cakeQuantity++;
		formData.append("Order", JSON.stringify(obj))
		}
	})

	order.forEach(item => {
		if (item.parentElement.parentElement.id != "Cake" && item.parentElement.parentElement.className.includes("itemWrapper") && item.checked == true){
			counter++;
			let obj = {
				"Item": item.parentElement.parentElement.id,
				"Flavour": item.nextElementSibling.innerHTML,
				"Quantity": document.getElementById(item.id+1).value
			}
			formData.append("Order", JSON.stringify(obj))

		} else if (item.parentElement.parentElement.id != "mainHeader"  && !(item.id.startsWith("Cake")) && item.parentElement.className.startsWith("Flavours") && item.checked == true){
			counter++;
			let obj = {
				"Item": item.parentElement.parentElement.id,
				"Flavour": item.nextElementSibling.innerHTML,
				"Quantity": document.getElementById(item.id+1).value
			}
			formData.append("Order", JSON.stringify(obj))

		} else if (item.parentElement.parentElement.id != "mainHeader" && !(item.id.startsWith("Cake")) && item.checked == true) {
			counter++;
			let obj = {
				"Item": item.nextElementSibling.innerHTML,
				"Quantity": document.getElementById(item.id+1).value
			}
			formData.append("Order", JSON.stringify(obj))
		}
	})


	if (counter == 0) {
		const error = new Error("Please select the type of item you'd like to Enquirie about.");
		error.focus = "CakeCheckBox";
		throw error;
	}

	if (message.value == "") {
		const error = new Error("Please give me some details about the items you'd like to order.");
		error.focus = "EnquirieInput";
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

	if (fullPrice.value == "") {
		const error = new Error("Please enter price of the order");
		error.focus = "fullPrice";
		throw error;
	} else {
		formData.append("fullPrice", fullPrice.value);
	}

	if (!(paidFull.checked || paidDeposit.checked || paidNone.checked)) {
		const error = new Error("Please select prepayment");
		error.focus = "paidFull";
		throw error;
	} else {

		if(paidFull.checked) {
			formData.append("portionPaid", "Full");
		} else if (paidDeposit.checked) {
			formData.append("portionPaid", "Deposit");
			if(depositPaid.value == "") {
				const error = new Error("Please enter ammount already paid");
				error.focus = "depositPaid";
				throw error;
			} else {
				formData.append("depositPaid", depositPaid.value);
			}
		} else if (paidNone.checked) {
			formData.append("portionPaid", "None");
		}
	}
}
