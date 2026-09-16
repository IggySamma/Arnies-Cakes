//ESLint:
import { createElement } from './shared.js';
import { modalSubmit } from './enquiries.js';
import { enableDisable } from './enquiries.js';
import { updatePlaceholder } from './enquiries.js';
import { loadCalender, validation } from './enquiries.js';

window.getAllEnquiries = getAllEnquiries;
window.updateModal = updateModal;
window.paidReveal = paidReveal;
window.requestFullEnquiry = requestFullEnquiry;
window.enableDisable = enableDisable;
window.setID = setID;
window.createNewEnquiry = createNewEnquiry;
window.init = init;


//const { default: flatpickr } = require("flatpickr");

//const { createElement } = require("react");

//let disabledDates = [];
let confirmedEnquirys = []; /* eslint-disable-line */
let confirmedEnquirysTemp = [];

function init(){
	getAllEnquiries();
	getNotes();
}

async function getDisabledDates() {
	const response = await fetch('/api/disabledDates', { method: 'POST' });
	const data = await response.json();
	return data;
}

function getDatesInRange(from, to) {
	const startDate = new Date(from);
	const endDate = new Date(to);
	let dates = [];

	while (startDate <= endDate) {
		dates.push(startDate.toISOString().split('T')[0]); // Format as "YYYY-MM-DD"
		startDate.setDate(startDate.getDate() + 1);
	}

	return dates;
}

async function fetchDisabledDates() {
	const data = await getDisabledDates();
	let datesArray = [];

	data.Date.forEach((date, index) => {
	if (data.IsRange[index] === "Yes" && typeof date === "object") {
		datesArray.push(...getDatesInRange(date.from, date.to));
	} else if (typeof date === "string") {
		datesArray.push(date);
	}
	});

	//disabledDates = datesArray;
	//renderCalendar(currentMonth, currentYear);
}

function getAllEnquiries() {
	fetch('/api/allEnquiries', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: "include",
	})
	.then(response => response.json())
	.then(data => {
		displayEnquiries(data);
	})
}

function createNewEnquiry(){
	fetch('/api/newManualEnquiry',{
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		credentials: "include",
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		setID(data.ID);
	});
}

/*function updateNotes() {
	let notes = document.getElementById("notes").innerHTML;

	fetch('/api/updateAdminNotes', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		credentials: 'include',
		body: JSON.stringify({ notes })
	})
		.then(response => response.json())
		.then(data => {
			console.log(data);
		})
		.catch(error => {
			console.error(error);
		});
}*/

/*function getNotes(){
	fetch('/api/getAdminNotes',{
		method: 'GET',
		header: {'Content-Type': 'application/json'},
		credentials: "include",
	})
	.then(response => response.json())
	.then(data => {
		let notes = document.getElementById("notes");
		console.log(JSON.parse(JSON.stringify(data.notes)))
		notes.innerHTML = JSON.parse(JSON.stringify(data.notes));
		notes.addEventListener('onclick', notesFocusOut());
	})
}*/

let notesSaveTimeout;
let lastSavedNotes = null;

function getNotes() {
	fetch('/api/getAdminNotes', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	})
		.then(response => response.json())
		.then(data => {
			const notes = document.getElementById('notes');

			const savedNotes = data.notes ?? '';

			notes.value = savedNotes;
			lastSavedNotes = savedNotes;

			notes.addEventListener('input', notesChanged);
			notes.addEventListener('focusout', updateNotes);
		})
		.catch(error => {
			console.error('Failed to get notes:', error);
		});
}


function notesChanged() {
	clearTimeout(notesSaveTimeout);

	notesSaveTimeout = setTimeout(() => {
		updateNotes();
	}, 1000);
}


function updateNotes() {
	clearTimeout(notesSaveTimeout);

	const notes = document.getElementById('notes').value;

	if (notes === lastSavedNotes) {
		//console.log('Notes unchanged - not saving');
		return;
	}

	//console.log('Saving notes:', notes);

	fetch('/api/updateAdminNotes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({
			notes: notes
		})
	})
		.then(response => response.json())
		.then(data => {
			//console.log('Notes saved:', data);

			if (data.success) {
				lastSavedNotes = notes;
			}
		})
		.catch(error => {
			console.error('Failed to save notes:', error);
		});
}

function requestFullEnquiry(enquiry) {
	const card = enquiry.closest('.event-card');
	let id;

	if (card) {
		id = card.dataset.enquiryId;
	} else {
		id = String(enquiry.parentElement.parentElement.firstChild.innerHTML);
	}

	fetch('/api/requestEnquiry', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id }),
		credentials: "include",
	})
		.then(response => response.json())
		.then(data => {
			updateModal(data[0]);
		});
}

/*
function confirmEnquiry(enquiry){
	let id = enquiry.parentElement.parentElement.firstChild.innerHTML;
	const response = confirm(`All details are updated for enquiry ${id}?`);
	
	if(response){
		fetch('/api/confirmEnquiry', {
			method: 'POST',
			headers: {'Content-Type': 'application/json' },
			body: JSON.stringify({id}),
			credentials: "include",
		})
		.then((res) => {
			if(res.status === 200){
				location.reload();
			} else {
				console.log(res);
			}
		});
	}
}*/
/*
function declineEnquiry(enquiry){
	let id = enquiry.parentElement.parentElement.firstChild.innerHTML;
	

	if(response) {
		fetch('/api/declineEnquiry', {
			method: 'POST',
			headers: {'Content-Type': 'application/json' },
			body: JSON.stringify({id}),
			credentials: "include",
		})
		.then((res) => {
			if(res.status === 200){
				location.reload();
			} else {
				console.log(res);
			}
		});
	}
}*/

/*
function deleteEnquiry(enquiry){
	let id = enquiry.parentElement.parentElement.firstChild.innerHTML;
	const response = confirm(`Are you sure you want to delete enquiry ${id} ?`);
	
	if (response) {
		fetch('/api/deleteEnquiry', {
			method: 'POST',
			headers: {'Content-Type': 'application/json' },
			body: JSON.stringify({id}),
			credentials: "include",
		})
		.then((res) => {
			if(res.status === 200){
				location.reload();
			} else {
				console.log(res);
			}
		});
	}
}
*/

function displayEnquiries(data){
	const table = document.getElementById("enquiries");

	const header = createElement('tr', {}, "");
	table.appendChild(header);

	const headers = ["ID", "Name", "Date", "Link", "Action"];
	headers.forEach(heading => {
		const th = createElement('th', {}, "");
		th.innerHTML = heading;
		header.appendChild(th);
	})

	data.forEach( row => {
		if (row.Confirmed == 'No') {
			const tr = createElement('tr', {}, "");
			table.appendChild(tr);

			let tableData = [row.ID, row.Name, row.Date, row.Link, "Action"];
			tableData.forEach(column => {
				if(`${column}`.includes("https")){
					const td = createElement('td', {}, "");
					const a = createElement('a', {href: column, target: "_blank"}, "")
					a.innerHTML = "link"
					td.appendChild(a);
					tr.appendChild(td);
				} else if(`${column}`.includes("Action")){
					const td = createElement('td', {}, "");

					const confirm = createElement('a', { /*onclick: "requestFullEnquiry(this)", */'data-bs-toggle': 'modal' , 'data-bs-target':'#confirmEnquiry', 'onclick':'setID(this)'}, "", "Fill out details");

					td.appendChild(confirm);
					tr.appendChild(td);
				} else {
					const td = createElement('td', {}, "");
					td.innerHTML = column;
					tr.appendChild(td);
				}
			})
		} else if(row.Confirmed == 'Yes'){
			confirmedEnquirysTemp.push(row)
		}
	})
	
	//console.log(confirmedEnquirysTemp);
	//console.log(confirmedEnquirys);
	//earliestOrderDate();
	//console.log(earliestDate)
	fetchDisabledDates();
}

class modalMapping {
	constructor(data) {
		Object.assign(this, data);
	}

	static fieldMapValues = {
		Address: "AddressInput",
		Allergy_Message: "AllergyInput",
		ColDelDate: "datetimeEvent",
		Date: "datetimeDate",
		Email: "emailInput",
		Message: "EnquirieInput",
		Name: "fullNameInput",
		Number: "numberInput",
		Price: "fullPrice",
		PricePaid: "depositPaid"
	};

	clearFields() {
		for (const id of Object.values(modalMapping.fieldMapValues)) {
			if (!id) continue;

			const element = document.getElementById(id);
			if (element) {
				element.value = "";
			}
		}
	}

	update() {
		for (const [field, id] of Object.entries(modalMapping.fieldMapValues)) {
			const element = document.getElementById(id);
			if (element) {
				element.value = this[field] ?? "";
			}
		}

		this.tickUpdates();
	}

	/*updateFlatpickr() {
		const dateInput = document.getElementById("datetimeDate");
		const eventInput = document.getElementById("datetimeEvent");

		if (!dateInput || !eventInput) return;

		dateInput.value = this.Date?.split(",")[0] ?? "";
		eventInput.value = this.ColDelDate?.replace(", ", "T") ?? "";

		const flatpickrEvents = document.getElementsByClassName("flatpickrEvent");

		dateInput.flatpickr({
			altInput: true,
			altFormat: "F j, Y",
			allowInput: false,
			defaultDate: this.Date?.split(",")[0] ?? "",
			enableTime: false,
			dateFormat: "Y-m-d",
			maxDate: new Date().fp_incr(730),
			disableMobile: false,
			closeOnSelect: false,
			onChange: function (selectedDate, dateStr) {
				const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				});

				const col = document.getElementById("Collection");
				const del = document.getElementById("Delivery");
				if (col) col.removeAttribute("disabled");
				if (del) del.removeAttribute("disabled");

				const anchorDate = new Date(dateStr.split(' ', 1)[0]);

				eventInput.flatpickr({
					altInput: true,
					altFormat: "F j, Y, H:i",
					allowInput: false,
					defaultDate: `${anchorDate}, 12:00`,
					enableTime: true,
					dateFormat: "Y-m-d, H:i",
					minDate: anchorDate.fp_incr(-2),
					maxDate: anchorDate.fp_incr(1),
					enable: [anchorDate.fp_incr(-2), anchorDate.fp_incr(-1), anchorDate],
					minTime: "10:00",
					maxTime: "20:00",
					defaultHour: 12,
					defaultMinute: 0,
					minuteIncrement: 15,
					disableMobile: false
				});

				if (flatpickrEvents[0]) flatpickrEvents[0].value = `${dateStr.split(' ', 1)[0]}, 12:00`;
				if (flatpickrEvents[1]) flatpickrEvents[1].value = `${formattedDate}, 12:00`;
			}
		});

		eventInput.flatpickr({
			altInput: true,
			altFormat: "F j, Y, H:i",
			allowInput: false,
			defaultDate: this.ColDelDate?.replace(", ", "T") ?? "",
			enableTime: true,
			dateFormat: "Y-m-d H:i",
			maxDate: new Date().fp_incr(730),
			defaultHour: 12,
			defaultMinute: 0,
			minuteIncrement: 15,
			disableMobile: false
		});
	}*/

	updateFlatpickr() {
		const dateInput = document.getElementById("datetimeDate");
		const eventInput = document.getElementById("datetimeEvent");

		if (!dateInput || !eventInput) return;

		const initialDate = this.Date?.split(",")[0] ?? "";
		const initialEventDate = this.ColDelDate?.replace(", ", "T") ?? "";

		// Create the date picker only once
		if (!this.datePicker) {
			this.datePicker = flatpickr(dateInput, { /* eslint-disable-line  */
				altInput: true,
				altFormat: "F j, Y",
				allowInput: false,
				enableTime: false,
				dateFormat: "Y-m-d",
				maxDate: new Date().fp_incr(730),
				disableMobile: false,
				closeOnSelect: false,

				// Avoid Firefox's native month <select> behaviour
				monthSelectorType: "static",
				static: true,

				onOpen: () => {
					const modalBody = document.getElementById("modal-body");
					if (modalBody) modalBody.style.overflow = "visible";
					console.log('FLATPICKR: opened')
				},
				onClose: () => {
					const modalBody = document.getElementById("modal-body");
					if (modalBody) modalBody.style.overflow = "auto";
					console.log('FLATPICKR: closed', new Error().stack)
				},

				onChange: (selectedDates, dateStr) => {
					if (!selectedDates.length) return;

					const anchorDate = selectedDates[0];

					const formattedDate = anchorDate.toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric"
					});

					const col = document.getElementById("Collection");
					const del = document.getElementById("Delivery");

					if (col) col.removeAttribute("disabled");
					if (del) del.removeAttribute("disabled");

					// Create the event picker only once
					if (!this.eventPicker) {
						this.createEventPicker(eventInput);
					}

					this.eventPicker.set(
						"minDate",
						anchorDate.fp_incr(-2)
					);

					this.eventPicker.set(
						"maxDate",
						anchorDate.fp_incr(1)
					);

					this.eventPicker.set(
						"enable",
						[
							anchorDate.fp_incr(-2),
							anchorDate.fp_incr(-1),
							anchorDate
						]
					);

					this.eventPicker.setDate(
						`${dateStr}, 12:00`,
						false
					);

					const flatpickrEvents =
						document.getElementsByClassName("flatpickrEvent");

					if (flatpickrEvents[0]) {
						flatpickrEvents[0].value =
							`${dateStr}, 12:00`;
					}

					if (flatpickrEvents[1]) {
						flatpickrEvents[1].value =
							`${formattedDate}, 12:00`;
					}
				}
			});
		}

		// Create the event picker only once
		if (!this.eventPicker) {
			this.createEventPicker(eventInput);
		}

		if (initialDate) {
			this.datePicker.setDate(initialDate, false);
		}

		if (initialEventDate) {
			this.eventPicker.setDate(initialEventDate, false);
		}
	}


	createEventPicker(eventInput) {
		this.eventPicker = flatpickr(eventInput, { /* eslint-disable-line  */
			altInput: true,
			altFormat: "F j, Y, H:i",
			allowInput: false,
			enableTime: true,
			dateFormat: "Y-m-d, H:i",
			maxDate: new Date().fp_incr(730),
			defaultHour: 12,
			defaultMinute: 0,
			minuteIncrement: 15,
			disableMobile: false,
			monthSelectorType: "static",
			static: true
		});
	}

	tickUpdates() {
		if (this.Allergy === 'Yes!') {
			this.enableTickByID("AllergyYes");
			enableDisable('AllergyNo');
		} else if (this.Allergy === 'No') {
			this.enableTickByID("AllergyNo");
			enableDisable('AllergyYes');
		}

		if (this.ColDel === 'Collection') {
			this.enableTickByID("Collection");
			hide(document.getElementById("AddressField"));
			//enableDisable('Delivery');
			
			this.updateFlatpickr();
		} else if (this.ColDel === 'Delivery') {
			this.enableTickByID("Delivery");
			show(document.getElementById("AddressField"));
			
			//enableDisable('Collection');
			
			this.updateFlatpickr();
		}
		this.updatePaidStatus();
		this.orderParse();
	}
	
	updatePaidStatus() {
		const price = Number(this.Price) || 0;
		const pricePaid = Number(this.PricePaid) || 0;

		if (pricePaid === 0) {
			this.enableTickByID("paidNone");
		} else if (price === pricePaid) {
			this.enableTickByID("paidFull");
		} else {
			this.enableTickByID("paidDeposit");

			const depositPaidContainer = document.getElementById("depositPaidContainer");
			if (depositPaidContainer) {
				depositPaidContainer.style.display = "block";
			}
		}
	}

	enableTickByID(id) {
		const element = document.getElementById(id);
		if (!element) return;

		element.checked = true;
		element.disabled = false;
		element.removeAttribute("required");
	}

	disableTickByID(id) {
		const element = document.getElementById(id);
		if (!element) return;

		element.checked = false;
		element.disabled = true;
		element.setAttribute("required", "");
	}

	orderParse() {
		if (!this.Order_Details) return;

		let order;

		// -----------------------------
		// Parse Order_Details
		// -----------------------------
		try {
			let raw = this.Order_Details.trim();

			// First parse the outer JSON
			let parsed = JSON.parse(raw);

			// Handle double-encoded JSON
			if (typeof parsed === 'string') {
				raw = parsed.trim();

				if (raw.startsWith('[')) {
					parsed = JSON.parse(raw);
				} else {
					// Handle:
					// "{\"Item\":\"Cake\"},{\"Item\":\"Cakesicles\"}"
					parsed = JSON.parse(`[${ raw }]`);
				}
			}

			// Allow a single object
			if (!Array.isArray(parsed)) {
				parsed = [parsed];
			}

			// Handle arrays containing JSON strings
			order = parsed
				.map(item => {
					if (typeof item === 'string') {
						return JSON.parse(item);
					}

					return item;
				})
				.map(item =>
					Object.fromEntries(
						Object.entries(item).map(([key, value]) => [
							key,
							typeof value === 'string'
								? value.trim()
								: value
						])
					)
				);

		} catch (error) {
			console.error('Failed to parse Order_Details:', {
				raw: this.Order_Details,
				error
			});

			return;
		}

		// -----------------------------
		// Update the UI
		// -----------------------------
		try {
			this.orderUpdate(order);
		} catch (error) {
			console.error('Failed to update order UI:', error, {
				order
			});
		}
	}

	orderUpdate(data) {
		data.forEach(item => {
			const hasFlavour = Boolean(item.Flavour);

			const product = hasFlavour
				? item.Item?.trim() || ""
				: (item.Item?.trim() || "").replace(/\s+/g, "");

			const flavour = item.Flavour?.trim() || "";

			const ids = {
				itemCheckbox: `${product}CheckBox`,
				flavourCheckbox: `${product}${flavour}CheckBox`,
				cakeSize: `${product}${flavour}CakeSize`,
				quantity: `${product}${flavour}CheckBox1`
			};

			this.enableIfExists(ids.itemCheckbox);

			if (flavour) {
				this.enableIfExists(ids.flavourCheckbox);
				updatePlaceholder(product + flavour);
			}

			if (item["Cake Size"]) {
				updatePlaceholder(product + flavour);

				const cakeSize = document.getElementById(ids.cakeSize);
				if (cakeSize) {
					cakeSize.value = item["Cake Size"];
				}
			}

			const quantity = document.getElementById(ids.quantity);
			if (quantity) {
				quantity.value = item.Quantity;
				quantity.disabled = false;
			}
		});
	}

	enableIfExists(id) {
		const element = document.getElementById(id);
		if (element) {
			element.checked = true;
		}
	}

	resetInputs() {
		document.querySelectorAll('input').forEach(input => {
			switch (input.type) {
				case "checkbox":
				case "radio":
					input.checked = false;
					break;
				default:
					input.value = "";
			}
		});
	}

	modalDestroy() {
		this.clearFields();

		document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
			if (checkbox.checked) {
				this.disableTickByID(checkbox.id);
			}
			if (checkbox.disabled) {
				checkbox.disabled = false;
				checkbox.setAttribute("required", "");
			}
		});

		this.resetInputs();

		document.getElementById("confirmEnquiryID").innerHTML = `ID: `
	}
}

document.addEventListener("focusin", (e) => {
	if (e.target.closest(".flatpickr-calendar")) {
		e.stopImmediatePropagation();
	}
}, true);


function updateModal(data){
	console.log(data)
	document.getElementById("confirmEnquiryID").innerHTML = `ID: ${data.ID}`
	const modalConfirm = document.getElementById("submitEnquiry");
	const modalReject = document.getElementById("rejectEnquiry");
	const modalComplete = document.getElementById("completeEnquiry");

	if (!modalConfirm || !modalReject || !modalComplete) return;

	removeOldListeners(modalConfirm, 'click');
	removeOldListeners(modalReject, 'click');
	removeOldListeners(modalComplete, 'click');


	modalConfirm.addEventListener('click', (e) => {
		e.preventDefault();
		submitEnquiry();
	});

	modalReject.addEventListener('click', (e) => {
		e.preventDefault();
		rejectEnquiry();
	});

	modalComplete.addEventListener('click', (e) => {
		e.preventDefault();
		completeEnquiry();
	});
	let modalData = new modalMapping(data);
	modalData.update();

	let dismissButton = document.getElementById("dismissEnquiry");

	//Clears previous listeners
	dismissButton.parentNode.replaceChild(dismissButton.cloneNode(true), dismissButton);
	dismissButton = document.getElementById("dismissEnquiry");

	dismissButton.addEventListener("click", () => {
		modalData.modalDestroy();
	});
}

function setID(data) {

	let idValue;

	if (typeof data === 'number' || typeof data === 'string') {
		idValue = data;
	} else {
		idValue = data.parentElement.parentElement.firstChild.innerHTML;
	}

	document.getElementById("confirmEnquiryID").innerHTML = `ID: ${idValue}`;

	const modalConfirm = document.getElementById("submitEnquiry");
	const modalReject = document.getElementById("rejectEnquiry");
	const modalComplete = document.getElementById("completeEnquiry");

	if (!modalConfirm || !modalReject || !modalComplete) return;

	removeOldListeners(modalConfirm, 'click');
	removeOldListeners(modalReject, 'click');
	removeOldListeners(modalComplete, 'click');


	modalConfirm.addEventListener('click', (e) => {
		e.preventDefault();
		submitEnquiry();
	});

	modalReject.addEventListener('click', (e) => {
		e.preventDefault();
		rejectEnquiry();
	});

	modalComplete.addEventListener('click', (e) => {
		e.preventDefault();
		completeEnquiry();
	});

	loadCalender();
}

function removeOldListeners(element, type) {
	while (element && element.parentNode) {
		try {
			if (type in element) {
				element.removeEventListener(type, null);
			}
		} catch (err) { 
			console.log(err);
		}
		break;
	}
}

function submitEnquiry(event){
	if (event) event.preventDefault();

	const formData = new FormData();
	let errors = false;

	const idElement = document.getElementById("confirmEnquiryID");
	let enquiryId;
	if (idElement && idElement.textContent.includes('ID: ')) {
		enquiryId = parseInt(idElement.textContent.replace('ID: ', ''));
		formData.append("ID", enquiryId);
	}

	try {
		validation(formData);
	} catch (error) {
		errors = true;
		handleValidationErrors(error, formData);
	}

	if (!errors) {
		submitToBackend(formData);
	}
};

function submitToBackend(formData) {
    fetch('/api/updateEnquirie', {
        method: 'POST',
        body: formData,
    })
    .then((res) => {
        if (res.status === 200) {
            window.location.reload();
            return;
        }

        throw new Error(`Request failed: ${ res.status } `);
    })
    .catch((err) => {
        console.error(err);

        document.body.style.cursor = 'auto';

        const submit = document.getElementById("submit");
        if (submit) {
            submit.disabled = false;
        }
    });
}

function handleValidationErrors(error/*, formData*/) {
	document.body.style.cursor = 'auto';
	const submitBtn = document.getElementById("submit");
	if (submitBtn) submitBtn.disabled = false;

	// Focus handling
	if (error.focus == "datetimeDate" || error.focus == "datetimeEvent") {
		document.getElementById(error.focus).nextElementSibling.focus();
	} else {
		document.getElementById(error.focus).focus();
	}

	alert(error.message);
}

/*
function handleResponse(response) {
	switch (response.status) {
		case 200:
			window.location.href = "/enquiriesty";
			break;
		default:
			try {
				const errorElementId = response.statusText.toLowerCase();
				throw new Error(`Server error: ${response.statusText}`, { focus: errorElementId });
			} catch (e) {
				handleValidationErrors(e, formData);
			}
	}

	document.body.style.cursor = 'auto';
	if (document.getElementById("submit"))
		document.getElementById("submit").disabled = false;
}*/

function rejectEnquiry(){
	let id = document.getElementById("confirmEnquiryID").innerHTML.split(' ')[1]
	const response = confirm(`Are you sure you want to decline the enquiry id: ${id} ?`);

	if (response) {
		fetch('/api/declineEnquiry', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id }),
			credentials: "include",
		})
		.then((res) => {
			if (res.status === 200) {
				location.reload();
			} else {
				console.log(res);
			}
		});
	}
};

function completeEnquiry() {
	let id = document.getElementById("confirmEnquiryID").innerHTML.split(' ')[1]
	const response = confirm(`You're about to complete the enquiry id: ${id} is this correct ?`);

	if (response) {
		fetch('/api/completeEnquiry', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id }),
			credentials: "include",
		})
			.then((res) => {
				if (res.status === 200) {
					location.reload();
				} else {
					console.log(res);
				}
			});
	}
};


/*---------------------------------  Disable Dates  ------------------------------------*/

const datesMode = document.getElementById("DateOptions");
const disableDatesCalendar = document.getElementById("disableDates");
const disableDatesWrapper = document.getElementById("disableDatesWrapper");
const disableSubmitWrapper = document.getElementById("submitWrapper");
const disableSubmitButton = document.getElementById("submitDisable");
const disableEnable = document.getElementById("disableEnable");
const enableLabel = document.getElementById("enableDatesLabel");
const disableLabel = document.getElementById("disableDatesLabel");
const dateOptionsWrapper = document.getElementById("DateOptionsWrapper");


export function hide(...elements) {
	elements.forEach(el => el.style.display = 'none');
}

export function show(...elements) {
	elements.forEach(el => el.style.display = 'block');
}

hide(
	dateOptionsWrapper,
	disableDatesWrapper,
	disableSubmitWrapper,
	enableLabel,
	disableLabel
);

let alreadyDisabledDates;

(async () => {
	const res = await fetch('/api/disabledDates', { method: 'POST' });
	const data = await res.json();
	alreadyDisabledDates = data;
})();

let defaultCalendarSettings = {
	altInput: true,
	altFormat: "F j, Y",
	enableTime: false,
	dateFormat: "Y-m-d",
	disableMobile: false,
	/*"plugins": [new confirmDatePlugin({})],*/
	onClose: function () {
		if (disableDatesCalendar.value !== '') {
			show(disableSubmitWrapper);
		} else {
			hide(disableSubmitWrapper);
		};
	},
	onDayCreate: function (dObj, dStr, fp, dayElem) {
		const dateStr = fp.formatDate(dayElem.dateObj, "Y-m-d");
		//console.log(alreadyDisabledDates.Date);

		if (alreadyDisabledDates.Date.includes(dateStr)) {
			if (disableEnable.value == "1"){
				dayElem.classList.add("disabled-highlight");
			} else if (disableEnable.value == "2") {
				dayElem.classList.add("enabled-highlight");
			}
		}
	}
};


disableEnable.addEventListener("change", () => {
	if (disableEnable.value == "1") {
		hide(
			disableDatesWrapper,
			disableSubmitWrapper,
			enableLabel,
			disableLabel
		);
		show(dateOptionsWrapper, disableLabel);
	} else if (disableEnable.value == "2") {
		hide(
			disableDatesWrapper,
			disableSubmitWrapper,
			enableLabel,
			disableLabel
		);
		show(dateOptionsWrapper, enableLabel);
	} else {
		hide(
			dateOptionsWrapper,
			disableDatesWrapper,
			disableSubmitWrapper,
			enableLabel,
			disableLabel
		);
	};
});

datesMode.addEventListener("click", () => {
	if (datesMode.value == "1" || datesMode.value == "2") {
		show(disableDatesWrapper);
		if (disableEnable.value == "1"){ //Disable
			if (datesMode.value == "1") {
				if (disableDatesCalendar._flatpickr) {
					disableDatesCalendar._flatpickr.destroy();
				}
				disableDatesCalendar.flatpickr({
					...defaultCalendarSettings,
					minDate: new Date().fp_incr(2),
					maxDate: new Date().fp_incr(730),
					disable: alreadyDisabledDates.Date,
					disableMobile: false,
					mode: "multiple"
				});
			} else {
				if (disableDatesCalendar._flatpickr) {
					disableDatesCalendar._flatpickr.destroy();
				}
				disableDatesCalendar.flatpickr({
					...defaultCalendarSettings,
					minDate: new Date().fp_incr(2),
					maxDate: new Date().fp_incr(730),
					disable: [],
					disableMobile: false,
					mode: "range"
				});
			}
		} else if (disableEnable.value == "2") { //Enable
			if (datesMode.value == "1") {
				if (disableDatesCalendar._flatpickr) {
					disableDatesCalendar._flatpickr.destroy();
				}
				disableDatesCalendar.flatpickr({
					...defaultCalendarSettings,
					minDate: new Date().fp_incr(2),
					maxDate: new Date().fp_incr(730),
					enable: alreadyDisabledDates.Date,
					disableMobile: false,
					mode: "multiple"
				});
			} else {
				if (disableDatesCalendar._flatpickr) {
					disableDatesCalendar._flatpickr.destroy();
				}
				disableDatesCalendar.flatpickr({
					...defaultCalendarSettings,
					minDate: new Date().fp_incr(2),
					maxDate: new Date().fp_incr(730),
					disable: [],
					disableMobile: false,
					mode: "range"
				});
			}
		}
		
		
	} else {
		hide(disableDatesWrapper);
	};
});



disableSubmitButton.addEventListener("click", () => {
	if (datesMode.value == '1' || datesMode.value == '2') {
		if (disableDatesCalendar.value !== '') {
			const formData = new FormData();
			var error = false
			let isRange;
			let toDisable;

			if (datesMode.value == "1") {
				isRange = false;
			} else if (datesMode.value == "2") {
				isRange = true;
			} else {
				error = true;
				alert("isRange not attached correctly");
				//throw new Error("isRange not attached correctly");
			}
			console.log(disableEnable);
			console.log(disableEnable.value);
			if (disableEnable.value == "1") { //Disable)
				toDisable = true
			} else if (disableEnable.value == "2"){
				toDisable = false
			} else {
				error = true;
				alert("Enable/Disable not attached correctly");
				//throw new Error("Enable/Disable not attached correctly");
			}

			if(!error) {
				formData.append("Dates", disableDatesCalendar.value);
				formData.append("isRange", isRange);
				formData.append("toDisable", toDisable);

				fetch('/api/addDisableDates', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						Dates: disableDatesCalendar.value,
						isRange: isRange,
						toDisable: toDisable,
					})
				})
				.then((res) => {
					if (res.status === 200) {
						location.reload();
						//console.log(res);
					} else if (res.status === 403){
						location.reload();
					} else {
						console.log(res);
					}
				});
			}

			
		
		} else {
			alert("Disabled Dates is blank");
			throw new Error("Disabled Dates is blank");
		}
	} else {
		alert("Please select a mode for date disabling");
		throw new Error("Please select a mode for date disabling");
	}
})

/*function returnFromTodayString(days = 0) {
	let date = new Date();
	date.setDate(date.getDate() + days);
	date = date.toISOString().split('T')[0];
	return date;
}*/
const { createCalendar, createViewMonthGrid } = window.SXCalendar;
const { createEventsServicePlugin } = window.SXEventsService;

import { createCalendarControlsPlugin } from './CalendarControls.js';
/*import { response } from 'express';*/

const calendarElement = document.getElementById('calendar');
const detailsPanel = document.getElementById('day-details');
const nextEventPanel = document.getElementById('next-event');

const calendarControls = createCalendarControlsPlugin();
const eventsService = createEventsServicePlugin();

document.documentElement.style.setProperty(
	'--arnies-color',
	'#D3BBDD'
);

function returnFromTodayString(days = 0) {
	const date = new Date();

	date.setDate(date.getDate() + days);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

const today = returnFromTodayString();

const calendar = createCalendar(
	{
		views: [
			createViewMonthGrid(),
		],

		calendars: {
			Arnies: {
				colorName: 'Arnies',

				lightColors: {
					main: '#D3BBDD',
					container: '#E0D2E4',
					onContainer: '#000000',
				},
			},

			Completed: {
				colorName: 'Completed',

				lightColors: {
					main: '#5F9871',
					container: '#CFE6D7',
					onContainer: '#000000',
				},
			},

			Declined: {
				colorName: 'Declined',

				lightColors: {
					main: '#C98D98',
					container: '#D19BA5',
					onContainer: '#000000',
				},
			},
		},

		firstDayOfWeek: 1,

		selectedDate: today,

		isDark: false,

		minDate: '2018-01-01',

		maxDate: returnFromTodayString(365),

		monthGridOptions: {
			nEventsPerDay: 1,
		},

		showWeekNumbers: true,

		isResponsive: false,

		skipAnimations: false,

		events: [],

		callbacks: {

			onClickDate(date) {
				renderDayDetails(date);
			},

			onEventClick(calendarEvent) {

				const dateStr = calendarEvent.start
					.toString()
					.split('T')[0];

				renderDayDetails(dateStr);
			},

			onClickPlusEvents(date) {
				renderDayDetails(date.toString());
			},
		},
	},

	[
		eventsService,
		calendarControls,
	]
);

calendar.render(calendarElement);
renderNextUpcomingEvent();

function parseOrderDetails(raw) {
	if (!raw) return [];

	try {
		let str = raw.trim();

		// First parse the outer JSON
		let parsed = JSON.parse(str);

		// If the result is a string, it may contain:
		// - a JSON array
		// - comma-separated JSON objects
		if (typeof parsed === "string") {
			str = parsed.trim();

			if (str.startsWith('[')) {
				parsed = JSON.parse(str);
			} else {
				// Wrap comma-separated objects in an array
				parsed = JSON.parse(`[${ str }]`);
			}
		}

		// Allow a single object as well
		if (!Array.isArray(parsed)) {
			parsed = [parsed];
		}

		// Preserve original behaviour:
		// array items can themselves be JSON strings
		return parsed.map(item =>
			typeof item === "string"
				? JSON.parse(item)
				: item
		);

	} catch (err) {
		console.error("Failed to parse order details:", {
			error: err,
			raw
		});

		return [];
	}
}

function renderOrderTable(rawOrderDetails) {
	const items = parseOrderDetails(rawOrderDetails);

	if (items.length === 0) return '';

	// Only include columns that have at least one non-empty value across all items
	const possibleColumns = [
		{ key: "Item", label: "Item", type: "text" },
		{ key: "Flavour", label: "Flavour", type: "text" },
		{ key: "Cake Size", label: "Size", type: "numeric" },
		{ key: "Quantity", label: "Qty", type: "numeric" }
	];

	const columns = possibleColumns.filter(col =>
		items.some(item => item[col.key] !== undefined && item[col.key] !== "")
	);

	const headerRow = columns.map(col =>
		`<th class="col-${col.type}">${col.label}</th>`
	).join('');

	const bodyRows = items.map(item => {
		const cells = columns.map(col =>
			`<td class="col-${col.type}">${item[col.key] ?? ''}</td>`
		).join('');
		return `<tr>${cells}</tr>`;
	}).join('');

	return `
		<table class="table table-sm order-table">
			<thead>
				<tr>${headerRow}</tr>
			</thead>
			<tbody>
				${bodyRows}
			</tbody>
		</table>
	`;
}

function renderNextUpcomingEvent() {
	const allEvents = eventsService.getAll();
	const [year, month, day] = new Date().toISOString().split('T')[0].split('-');
	const todayStr = `${day}-${month}-${year}`;


	const upcoming = allEvents
		.map(ev => ({ ...ev, startDate: ev.start.toString().split('T')[0] }))
		.filter(ev => ev.completed === 'No' && ev.startDate >= todayStr)
		.sort((a, b) => a.startDate.localeCompare(b.startDate));

	if (upcoming.length === 0) {
		nextEventPanel.innerHTML = `
            <h4>Next Upcoming Event</h4>
            <p style="color:#888;">No upcoming events.</p>
        `;
		return;
	}

	const next = upcoming[0];
	nextEventPanel.innerHTML = `
        <h4>Next Upcoming Event</h4>
        <div class="event-card">
            	<strong>${next.title}</strong><br/>
            	<small>📅 ${next.start.toString().split('T')[0].split('-').reverse().join('-') }</small>
		<p>
			${next.delivery ? `🚗 ${next.delivery}` : ''}
			${next.time ? `🕑 ${next.time}` : ''}
			${next.description ? `📒 ${next.description}` : ''}
		</p>
        </div>
    `;
}

function renderDayDetails(dateStr) {
	const allEvents = eventsService.getAll();

	const dayEvents = allEvents.filter(ev => {
		const start = ev.start.toString().split('T')[0];
		const end = ev.end.toString().split('T')[0];
		return dateStr >= start && dateStr <= end;
	});

	dateStr = dateStr.split('-').reverse().join('-')

	if (dayEvents.length === 0) {
		detailsPanel.innerHTML = `
            <h3>${dateStr}</h3>
            <p style="color:#888;">No events on this day.</p>
        `;
		return;
	}


	detailsPanel.innerHTML = `
		<h3> ${ dateStr }</h3>
			${
				dayEvents.map(ev => {
					const completed = ev.completed === 'Yes';
					const rejected = ev.completed === 'Rejected';

					return `
		<div class="event-card ${completed ? 'event-completed' : ''} ${rejected ? 'event-rejected' : ''}" style="position: relative;" data-enquiry-id="${ev.id}">
			<button
				type="button"
				class="btn btn-sm btn-outline-secondary"
				style="position: absolute; top: 10px; right: 10px;"
				onclick="requestFullEnquiry(this)"
				data-bs-toggle="modal"
				data-bs-target="#confirmEnquiry"
			>Edit</button>

			<a
				target="_blank"
				class="btn btn-sm btn-outline-secondary"
				style="position: absolute; top: 10px; right: 60px;"
				href="${ev.link}"
			>Email</a>

			<strong>
				${ev.title}${completed ? ' - Completed' : ''}${rejected ? ' - Rejected' : ''}
			</strong><br/>

			<small>
				
				📅 ${ev.start.toString().split('T')[0].split('-').reverse().join('-')}
				
			</small>

			<p>
				
				${ev.time ? `🕑 ${ev.time}<br/>` : ''}
				${ev.delivery ? `🚗 ${ev.delivery}<br/>` : ''}
				${ev.location ? `🌎 ${ev.location}<br/>` : ''}
				${ev.number ? `📞 ${ev.number}<br/>` : ''}
				${ev.price ? `💸 ${ev.price}<br/>` : ''}
				${ev.paid ? `💲 ${ev.paid}<br/>` : ''}
				${ev.allergy ? `🤒 ${ev.allergy}<br/>` : ''}
				${ev.description ? `📒 ${ev.description}<br/>` : ''}
				
			</p>
			
			${renderOrderTable(ev.order)}
		
		</div>
		`;
				}).join('')
	}
	`;


	if (window.matchMedia('(max-width: 768px)').matches) {
		detailsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	}
}

function mapEnquiryToEvent(enquiry) {
	const [datePart, timePart] = (enquiry.ColDelDate || "").split(",").map(s => s.trim());

	return {
		//calendarId: 'Arnies',
		calendarId: enquiry.Completed === 'Yes' ? 'Completed' : enquiry.Completed === 'Rejected'? 'Declined': 'Arnies',
		id: enquiry.ID? String(enquiry.ID) : '',
		link: enquiry.Link ? enquiry.Link : '',
		title: enquiry.Name? enquiry.Name : '',
		order: enquiry.Order_Details? enquiry.Order_Details : '',
		description: enquiry.Message? "Description: " + enquiry.Message : '',
		delivery: enquiry.ColDel? enquiry.ColDel : '',
		location: enquiry.Address? "Address: " + enquiry.Address : '',
		time: timePart ? "Time: " + timePart : '',
		price: enquiry.Price? "Price: " + enquiry.Price : '',
		paid: enquiry.PricePaid? "Paid: " + enquiry.PricePaid : '',
		allergy: enquiry.Allergy === 'Yes!' ? "Allergy: Yes, " + enquiry.Allergy_Message : 'Allergy: No',
		//allergyMessage: enquiry.Allergy === 'Yes!' ? "Allergy Message: " + enquiry.Allergy_Message : '',
		number: enquiry.Number ? "Number: " + enquiry.Number : '',
		start: datePart ? datePart : '',
		end: datePart ? datePart : '',
		completed: enquiry.Completed? enquiry.Completed : ''
	};
}

async function loadEvents() {
	const res = await fetch('/api/allConfirmedEnquiries', { method: 'POST' });

	if (!res.ok) {
		throw new Error(`Failed to load events: ${res.status}`);
	}

	const enquiries = await res.json();

	enquiries
		.map(mapEnquiryToEvent)
		.forEach(ev => calendar.eventsService.add(ev));


	renderNextUpcomingEvent(); 
}


loadEvents()


async function loadEnquiryForm() {
	try {
		const res = await fetch('/enquiries');
		if (!res.ok) {
			throw new Error(`Failed to load form: ${res.status}`);
		}

		const html = await res.text();

		// parse the fetched HTML string into a real DOM we can query
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');

		const form = doc.getElementById('form');
		if (!form) {
			throw new Error('No element with id="form" found in Enquiries.html');
		}

		const modalBody = document.getElementById('modal-body');
		modalBody.appendChild(form);

		let filesContainer = document.getElementById("files");
		filesContainer.parentElement.remove();

		let orignalSubmit = document.getElementById("submit");
		orignalSubmit.parentElement.remove();

		//createElement('a', {href: column, target: "_blank"}, "")
		const priceContainer = createElement("div", {}, "mb-3");
		const priceLabel = createElement("label", {"for": "fullPrice"}, "form-label", "Full Price:");
		const priceInput = createElement("textarea", { "id": "fullPrice", "type": "text", "rows": "1"}, "form-control form-control-lg");
		const priceInputInvalid = createElement("div", {}, "invalid-feedback", "Missing Full Price");

		priceContainer.appendChild(priceLabel);
		priceContainer.appendChild(priceInput);
		priceContainer.appendChild(priceInputInvalid);
		form.appendChild(priceContainer);

		const paidContainer = createElement("div", {}, "mb-3");
		const paidContainerLabel = createElement("label", { "for": "paidContainer" }, "form-label", "How much has been paid ?");
		const paidBreak = createElement("br", {}, "");
		const paidFullInput = createElement("input", { "id": "paidFull", "type": "checkbox", "onclick": 'paidReveal("")' }, "form-check-input mx-1 px-1");
		const paidFullLabel = createElement("label", { "for": "paidFull" }, "form-label", "Full");
		const paidDepositInput = createElement("input", { "id": "paidDeposit", "type": "checkbox", "onclick": 'paidReveal("")' }, "form-check-input mx-1 px-1");
		const paidDepositLabel = createElement("label", { "for": "paidDeposit" }, "form-label", "Deposit");
		const paidNoneInput = createElement("input", { "id": "paidNone", "type": "checkbox", "onclick": 'paidReveal("")'}, "form-check-input mx-1 px-1");
		const paidNoneLabel = createElement("label", { "for": "paidNone" }, "form-label", "None");
		const paidInputInvalid = createElement("div", {}, "invalid-feedback", "Please select payment details");

		paidContainer.appendChild(paidContainerLabel);
		paidContainer.appendChild(paidBreak);
		paidContainer.appendChild(paidFullInput);
		paidContainer.appendChild(paidFullLabel);
		paidContainer.appendChild(paidDepositInput);
		paidContainer.appendChild(paidDepositLabel);
		paidContainer.appendChild(paidNoneInput);
		paidContainer.appendChild(paidNoneLabel);
		paidContainer.appendChild(paidInputInvalid);
		form.appendChild(paidContainer);

		const depositPaidContainer = createElement("div", { "id": "depositPaidContainer"}, "mb-3");
		const depositPaidLabel = createElement("label", { "for": "depositPaid" }, "form-label", "Deposit Paid:");
		const depositPaidInput = createElement("textarea", { "id": "depositPaid", "type": "text", "rows": "1" }, "form-control form-control-lg");
		const depositPaidInputInvalid = createElement("div", {}, "invalid-feedback", "Missing Deposit Price");

		hide(depositPaidContainer);
		depositPaidContainer.appendChild(depositPaidLabel);
		depositPaidContainer.appendChild(depositPaidInput);
		depositPaidContainer.appendChild(depositPaidInputInvalid);
		form.appendChild(depositPaidContainer);

		//loadCalender();
		modalSubmit();
		

	} catch (err) {
		console.error('Error loading enquiry form:', err);
	}
}

loadEnquiryForm();

function paidReveal(amount = ""){
	const full = document.getElementById("paidFull");
	const deposit = document.getElementById("paidDeposit");
	const none = document.getElementById("paidNone");

	const depositPaidContainer = document.getElementById("depositPaidContainer");
	const depositPaidInput = document.getElementById("depositPaid");

	if(full.checked) {
		hide(depositPaidContainer);
		depositPaidInput.value = amount
		depositPaidInput.removeAttribute("required", "");
		full.disabled = false;
		deposit.disabled = true;
		none.disabled = true;
		return
	}

	if (deposit.checked) {
		show(depositPaidContainer);
		depositPaidInput.setAttribute("required", "");
		full.disabled = true;
		deposit.disabled = false;
		none.disabled = true;
		return
	}

	if (none.checked) {
		hide(depositPaidContainer);
		depositPaidInput.value = amount;
		depositPaidInput.removeAttribute("required");
		full.disabled = true;
		deposit.disabled = true;
		none.disabled = false;
		return
	}

	depositPaidInput.value = amount;
	depositPaidInput.removeAttribute("required");
	hide(depositPaidContainer);
	full.disabled = false;
	deposit.disabled = false;
	none.disabled = false;
	return

}