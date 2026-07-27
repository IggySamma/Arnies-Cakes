//const { default: flatpickr } = require("flatpickr");

//const { createElement } = require("react");

let disabledDates = [];
let confirmedEnquirys = [];
let confirmedEnquirysTemp = [];

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

	disabledDates = datesArray;
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

function requestFullEnquiry(enquiry){
	let id = String(enquiry.parentElement.parentElement.firstChild.innerHTML);
	id = {id}
	fetch('/api/requestEnquiry', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(id),
		credentials: "include",
	})
	.then(response => response.json())
	.then(data => {
		updateModal(data[0])
	})
}

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
}

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
}

function confirmation(){
	const response = confirm("Are you sure you want to delete ?");
	const parentPath = document.getElementsByClassName('ID:' + imageId)[0].src;;
	const pathSrc = parentPath.substring(parentPath.lastIndexOf('/'));
	
	if (response) {
		deletePicture(imageId, pathSrc.substring(1));
	}
  }

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

			tableData = [row.ID, row.Name, row.Date, row.Link, "Action"];
			tableData.forEach(column => {
				if(`${column}`.includes("https")){
					const td = createElement('td', {}, "");
					const a = createElement('a', {href: column, target: "_blank"}, "")
					a.innerHTML = "link"
					td.appendChild(a);
					tr.appendChild(td);
				} else if(`${column}`.includes("Action")){
					const td = createElement('td', {}, "");

					const confirm = createElement('a', { onclick: "requestFullEnquiry(this)", 'data-bs-toggle': 'modal' , 'data-bs-target':'#confirmEnquiry'}, "", "Fill out details");

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
	
	console.log(confirmedEnquirysTemp);
	console.log(confirmedEnquirys);
	//Sequencing callbackseeeeeeeeeeeeeeeee
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
		/*Allergy: "",*/
		Allergy_Message: "AllergyInput",
		/*ColDel: "",*/
		ColDelDate: "datetimeEvent",
		/*Completed: "",
		Confirmed: "",*/
		Date: "datetimeDate",
		Email: "emailInput",
		/*ID: " ",
		Link: "",*/
		Message: "EnquirieInput",
		Name: "fullNameInput",
		Number: "numberInput",
		//Order_Details: "",
		Price: "fullPrice",
		PricePaid: "depositPaid"
	}

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
				//element.InnerHtml = this[field] ?? "";
			}
		}

		this.tickUpdates();
	}

	updateFlatpickr(){
		const element = document.getElementById("datetimeDate");
		const element2 = document.getElementById("datetimeEvent");
		element.value = this.Date.split(",")[0] ?? "";
		element2.value = this.ColDelDate.replace(", ", "T") ?? "";

		var flatpickrDate = document.getElementById("datetimeDate");
		var flatpickrEvent = document.getElementById("datetimeEvent");
		var flatpickrEvents = document.getElementsByClassName("flatpickrEvent")

		flatpickrDate.flatpickr({
			altInput: true,
			altFormat: "F j, Y",
			allowInput: false,
			defaultDate: this.Date.split(",")[0] ?? "",
			enableTime: false,
			dateFormat: "Y-m-d",
			//minDate: new Date().fp_incr(0),
			maxDate: new Date().fp_incr(730),
			/*disable: data.Date,*/
			disableMobile: false,
			plugins: [new confirmDatePlugin({})],
			onClose: () => { fpDate = true },
			onChange: function (selectedDate, dateStr, instance) {
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
					minDate: new Date(dateStr.split(' ', 1)).fp_incr(-2),
					maxDate: new Date(dateStr.split(' ', 1)).fp_incr(1),
					enable: [new Date(dateStr.split(' ', 1)).fp_incr(-2), new Date(dateStr.split(' ', 1)).fp_incr(-1), new Date(dateStr.split(' ', 1))],
					minTime: "10:00",
					maxTime: "20:00",
					defaultHour: 12,
					defaultMinute: 0,
					minuteIncrement: 15,
					disableMobile: false,
					plugins: [new confirmDatePlugin({})],
					onClose: () => { fpEvent = true },
				});

				flatpickrEvents[0].value = dateStr.split(' ', 1) + ", 12:00";
				flatpickrEvents[1].value = formattedDate + ", 12:00";
			}
		});
		flatpickrEvent.flatpickr({
			altInput: true,
			altFormat: "F j, Y, H:i",
			allowInput: false,
			//defaultDate: data.MinDate + " 12:00",
			defaultDate: this.ColDelDate.replace(", ", "T") ?? "",
			enableTime: true,
			dateFormat: "Y-m-d H:i",
			//minDate: data.MinDate,
			//minDate: new Date().fp_incr(0),
			maxDate: new Date().fp_incr(730),
			//disable: data.Date,
			//minTime: "10:00",
			//maxTime: "18:00",
			defaultHour: 12,
			defaultMinute: 0,
			minuteIncrement: 15,
			disableMobile: false,
			plugins: [new confirmDatePlugin({})]
		});

	}

	tickUpdates(){
		if(this.Allergy === 'Yes!') {
			this.enableTickByID("AllergyYes");
			enableDisable('AllergyNo')
		} else if (this.Allergy === 'No') {
			this.enableTickByID("AllergyNo");
			enableDisable('AllergyYes')
		} 

		if (this.ColDel === 'Collection') {
			this.enableTickByID("Collection");
			enableDisable('Delivery');
			this.updateFlatpickr();
		} else if (this.ColDel === 'Delivery') {
			this.enableTickByID("Delivery");
			enableDisable('Collection');
			this.updateFlatpickr();
		}
		this.orderParse();
	}

	enableTickByID(id){
		var element = document.getElementById(id);
		element.checked = true;
		element.disabled = false;
		element.removeAttribute("required");
	}

	disableTickByID(id) {
		var element = document.getElementById(id);
		element.checked = false;
		element.disabled = true;
		element.setAttribute("required", "");
	}

	orderParse(){
		const order = JSON.parse(this.Order_Details)
			.map(item => JSON.parse(item))
			.map(item =>
				Object.fromEntries(
					Object.entries(item).map(([key, value]) => [
						key,
						typeof value === "string" ? value.trim() : value
					])
				)
			);
		//console.log(order);
		this.orderUpdate(order);
	}

	orderUpdate(data) {
		data.forEach(item => {
			const product = item.Item.trim();
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
		document.querySelectorAll('input')
			.forEach(input => {
				switch (input.type) {
					case "checkbox":
						input.checked = false;
						break;

					case "radio":
						input.checked = false;
						break;

					default:
						input.value = "";
				}

				//input.disabled = false;
			});
	}


	modalDestroy() {
		this.clearFields();
		let checkboxes = document.querySelectorAll('input[type="checkbox"]');
		checkboxes.forEach(checkbox => {
			if (checkbox.checked === true) {
				this.disableTickByID(checkbox.id);
			}
			if (checkbox.disabled === true) {
				checkbox.disabled = false;
				checkbox.setAttribute("required", "")
			}
		});
		this.resetInputs();
	}
}

/*function modalDestroy() {
	let checkboxes = document.querySelectorAll('input[type="checkbox"]');

	checkboxes.forEach(checkbox => {
		checkbox.checked = false;
	});
}*/

function updateModal(data){
	console.log(data)

	let modalData = new modalMapping(data);
	modalData.update();

	let dismissButton = document.getElementById("dismissEnquiry");

	dismissButton.addEventListener("click", () => {
		//let modalData = new modalMapping();
		//modalData.update();
		modalData.modalDestroy();
	});
/*
	let id = document.getElementById("confirmEnquiryID");
	id.innerHTML = `ID: ${data.ID}`
	const ids = [
		"confirmEnquiyID", "fullNameInput",
		"emailInput", "numberInput",
		
	]
*/

/*
	var flatpickrDate = document.getElementById("datetimeDate");
	var flatpickrEvent = document.getElementById("datetimeEvent");
	var flatpickrEvents = document.getElementsByClassName("flatpickrEvent")

	flatpickrDate.flatpickr({
		altInput: true,
		altFormat: "F j, Y",
		allowInput: false,
		defaultDate: new Date().fp_incr(0),
		enableTime: false,
		dateFormat: "Y-m-d",
		minDate: new Date().fp_incr(0),
		maxDate: new Date().fp_incr(730),
		/*disable: data.Date,*/
		/*disableMobile: false,
		plugins: [new confirmDatePlugin({})],
		onClose: () => { fpDate = true },
		onChange: function (selectedDate, dateStr, instance) {
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
				minDate: new Date(dateStr.split(' ', 1)).fp_incr(-2),
				maxDate: new Date(dateStr.split(' ', 1)).fp_incr(1),
				enable: [new Date(dateStr.split(' ', 1)).fp_incr(-2), new Date(dateStr.split(' ', 1)).fp_incr(-1), new Date(dateStr.split(' ', 1))],
				minTime: "10:00",
				maxTime: "20:00",
				defaultHour: 12,
				defaultMinute: 0,
				minuteIncrement: 15,
				disableMobile: false,
				plugins: [new confirmDatePlugin({})],
				onClose: () => { fpEvent = true },
			});

			flatpickrEvents[0].value = dateStr.split(' ', 1) + ", 12:00";
			flatpickrEvents[1].value = formattedDate + ", 12:00";
		}
	});
	flatpickrEvent.flatpickr({
		altInput: true,
		altFormat: "F j, Y, H:i",
		allowInput: false,
		//defaultDate: data.MinDate + " 12:00",
		defaultDate: new Date().fp_incr(0),
		enableTime: true,
		dateFormat: "Y-m-d H:i",
		//minDate: data.MinDate,
		minDate: new Date().fp_incr(0),
		maxDate: new Date().fp_incr(730),
		//disable: data.Date,
		//minTime: "10:00",
		//maxTime: "18:00",
		defaultHour: 12,
		defaultMinute: 0,
		minuteIncrement: 15,
		disableMobile: false,
		plugins: [new confirmDatePlugin({})]
	});*/
}

function updateInnerHTMLByID(inner, ID){
	let temp = document.getElementById(ID);
	temp.innerHTML = inner
}

/*---------------- calendar System ---------------------------*/

const calendarDates = document.querySelector('.calendar-dates');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let earliestDate;

const months = [
	'January', 'February', 'March', 'April', 'May', 'June', 
	'July', 'August', 'September', 'October', 'November', 'December'
];

function earliestOrderDate(){
	const div = document.getElementById("next-order-date");
	if(confirmedEnquirys.length > 0) {
		for(let i = 0; i < confirmedEnquirys.length; i++){
			if(i == 0) {
				earliestDate = confirmedEnquirys[i].Date.split(",")[0];
			}

			if(earliestDate > confirmedEnquirys[i].Date.split(",")[0]){
				earliestDate = confirmedEnquirys[i].Date.split(",")[0];
			}
		}
	} else {
		earliestDate = "No orders";
	}

	if(earliestDate != "No orders"){
		earliestDate = reverseDate(earliestDate);
	}

	div.innerHTML = `Next order Date: ${earliestDate}`
}

function reverseDate(date){
	let temp = date.split("-")
	temp.reverse();
	return temp.join("-");
}

function renderCalendar(month, year) {
	calendarDates.innerHTML = '';
	monthYear.textContent = `${months[month]} ${year}`;

	var firstDay = new Date(year, month, 1).getDay();
	firstDay--;

	const daysInMonth = new Date(year, month +1, 0).getDate();
  
	// Create blanks for days of the week before the first day
	for (let i = 0; i < firstDay; i++) {
	  const blank = createElement('div', {'disabled': ''}, 'calendar-box Disable');
	  calendarDates.appendChild(blank);
	}
  
	const today = new Date();
	const uMonth = month < 10? '0' + Number(month+1) : Number(month+1);

	// Populate the days
	for (let i = 1; i <= daysInMonth; i++) {
		const dDate = i < 10? '0' + i: i;
		const nDate = year + '-' + uMonth +  '-' + dDate;
		let day;

		/*console.log("Date: " + nDate + " : ", nDate == confirmedEnquirys[0].Date.split(',')[0])*/

		if (nDate == today.toISOString().split('T')[0]) {
			day = createElement('div', {'id': nDate, 'disabled': ''}, 'current-date calendar-box Disable', i);
		} else if (nDate < today.toISOString().split('T')[0]) {
			day = createElement('div', {'id': nDate, 'disabled': ''}, 'disabled-past calendar-box Disable', i);
		} else if(checkDisabled(nDate)) {
			day = createElement('div', {'id': nDate, 'disabled': ''}, 'disabled-busy calendar-box Disable', i);
		} else {
			day = createElement('div', {'id': nDate, 'disabled': ''}, 'calendar-box Disable', i);
		}

		checkEnquiryDate(nDate, day)

		calendarDates.appendChild(day);
	}
}

function checkDisabled(date){
	if(disabledDates.length > 0){
		for(let i = 0; i < disabledDates.length; i++){
			 if(date == disabledDates[i]){
				return true
			 }
		}
	}
	return false
}

function checkEnquiryDate(date, element){
	if(confirmedEnquirys.length > 0){
		for(let i = 0; i < confirmedEnquirys.length; i++){
			if(confirmedEnquirys[i].Date.split(',')[0] === date) {
				return addEnquiryOverview(confirmedEnquirys[i], element);
			}
		}
	}
	return
}

function addEnquiryOverview(data, element){
	element.removeAttribute('disabled')
	if(element.classList.contains('Disable')){
		element.classList.remove('Disable')
	}
	element.classList.add('Enabled')
	let div = createElement('div', {id: 'enq:' + data.ID, 'onclick': 'selectEnquiry(this)'}, 'rounded-4 enquiry m-0 p-1', data.Name)
	element.appendChild(div)	
	/*let div2 = createElement('div', {id: 'enq:' + data.ID}, 'rounded-5 enquiry m-0 p-1', data.Name)
	element.appendChild(div2)	
	let div3 = createElement('div', {id: 'enq:' + data.ID}, 'rounded-5 enquiry m-0 p-1', data.Name)
	element.appendChild(div3)*/
}


/*prevMonthBtn.addEventListener('click', () => {
	currentMonth--;
	if (currentMonth < 0) {
		currentMonth = 11;
		currentYear--;
	}
	renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener('click', () => {
	currentMonth++;
	if (currentMonth > 11) {
		currentMonth = 0;
		currentYear++;
	}
	renderCalendar(currentMonth, currentYear);
});
*/

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


function hide(...elements) {
	elements.forEach(el => el.style.display = 'none');
}

function show(...elements) {
	elements.forEach(el => el.style.display = 'block');
}

hide(
	/*disablingDateOptionsWrapper,
	enablingDateOptionsWrapper,*/
	dateOptionsWrapper,
	disableDatesWrapper,
	disableSubmitWrapper,
	enableLabel,
	disableLabel
);

let alreadyDisabledDates;
let overrideEnabledDates = [];

/*fetch('/api/disabledDates', {
	method: 'POST'
})
.then(response => {
	response.json().then(data => {
		//console.log(data)
		alreadyDisabledDates = data;
		//console.log(alreadyDisabledDates)
		disableDatesCalendar.flatpickr(defaultCalendarSettings);
	})
})*/

(async () => {
	const res = await fetch('/api/disabledDates', { method: 'POST' });
	const data = await res.json();
	alreadyDisabledDates = data;
})();


function isOverride(date) {
	return overrideEnabledDates.includes(date);
}

let defaultCalendarSettings = {
	altInput: true,
	altFormat: "F j, Y",
	enableTime: false,
	dateFormat: "Y-m-d",
	disableMobile: false,
	"plugins": [new confirmDatePlugin({})],
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
			/*disablingDateOptionsWrapper,
			enablingDateOptionsWrapper,*/
			disableDatesWrapper,
			disableSubmitWrapper,
			enableLabel,
			disableLabel
		);
		show(DateOptionsWrapper, disableLabel);
	} else if (disableEnable.value == "2") {
		hide(
			/*disablingDateOptionsWrapper,
			enablingDateOptionsWrapper,*/
			disableDatesWrapper,
			disableSubmitWrapper,
			enableLabel,
			disableLabel
		);
		show(DateOptionsWrapper, enableLabel);
	} else {
		hide(
			/*disablingDateOptionsWrapper,
			enablingDateOptionsWrapper,*/
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
			let error = false
			let isRange;
			let toDisable;

			if (datesMode.value == "1") {
				isRange = false;
			} else if (datesMode.value == "2") {
				isRange = true;
			} else {
				error = true;
				throw new Error("isRange not attached correctly");
				alert("isRange not attached correctly");
			}
			console.log(disableEnable);
			console.log(disableEnable.value);
			if (disableEnable.value == "1") { //Disable)
				toDisable = true
			} else if (disableEnable.value == "2"){
				toDisable = false
			} else {
				error = true;
				throw new Error("Enable/Disable not attached correctly");
				alert("Enable/Disable not attached correctly");
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
					} else if (res.status = 403){
						location.reload();
					} else {
						console.log(res);
					}
				});
			}

			
		
		} else {
			throw new Error("Disabled Dates is blank");
			alert("Disabled Dates is blank");
		}
	} else {
		throw new Error("Please select a mode for date disabling");
		alert("Please select a mode for date disabling");
	}
})

function returnFromTodayString(days = 0) {
	let date = new Date();
	date.setDate(date.getDate() + days);
	date = date.toISOString().split('T')[0];
	return date;
}
/*
const { createCalendar, createViewMonthAgenda } = window.SXCalendar;
const { createDragAndDropPlugin } = window.SXDragAndDrop;

const plugins = [
	createDragAndDropPlugin(),
]


const calendar = createCalendar({
	views: [createViewMonthAgenda()],
	firstDayOfWeek: 1,
	selectedDate: returnFromTodayString(),
	isDark: false,
	minDate: returnFromTodayString(),
	maxDate: returnFromTodayString(365),
	monthGridOptions: {
		nEventsPerDay: 4,
	},
	showWeekNumbers: true,
	isResponsive: false,
	skipAnimations: false,
	events: [
		{
			id: '1',
			title: 'Johns Cake',
			description: 'testing description',
			location: 'D24V9HK',
			start: '2026-07-23',
			end: '2026-07-23'
		},
		{
			id: '1',
			title: 'Johns Cake',
			start: '2026-07-23',
			end: '2026-07-23'
		},
		{
			id: '1',
			title: 'Johns Cake',
			start: '2026-07-23',
			end: '2026-07-23'
		},
		{
			id: '1',
			title: 'Johns Cake',
			start: '2026-07-24',
			end: '2026-07-24'
		},
		{
			id: '1',
			title: 'Johns Cake',
			start: '2026-07-25',
			end: '2026-07-25'
		},
		{
			id: '1',
			title: 'Johns Cake',
			start: '2026-07-25',
			end: '2026-07-25'
		},
	],
	plugins,
})

calendar.render(document.getElementById("calendar"))*/

const { createCalendar, createViewMonthGrid } = window.SXCalendar;
const { createEventsServicePlugin } = window.SXEventsService;

const eventsService = createEventsServicePlugin();
const detailsPanel = document.getElementById('day-details');
const nextEventPanel = document.getElementById('next-event');

document.documentElement.style.setProperty('--arnies-color', '#D3BBDD');

const calendar = createCalendar({
	views: [createViewMonthGrid()],
	calendars: {
		Arnies: {
			colorName: 'Arnies',
			lightColors: {
				main: '#D3BBDD',
				container: '#E0D2E4',
				onContainer: '#000000',
			},
		},
	},
	firstDayOfWeek: 1,
	selectedDate: returnFromTodayString(),
	isDark: false,
	minDate: returnFromTodayString(),
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
			const dateStr = calendarEvent.start.toString().split('T')[0];
			renderDayDetails(dateStr);
		},
		onClickPlusEvents(date) {
			renderDayDetails(date.toString());
		}
	}
}, [eventsService]);

calendar.render(document.getElementById('calendar'));

// populate "Next Upcoming Event" on load
renderNextUpcomingEvent();

function renderDayDetails(dateStr) {
	const allEvents = eventsService.getAll();

	const dayEvents = allEvents.filter(ev => {
		const start = ev.start.toString().split('T')[0];
		const end = ev.end.toString().split('T')[0];
		return dateStr >= start && dateStr <= end;
	});

	if (dayEvents.length === 0) {
		detailsPanel.innerHTML = `
            <h3>${dateStr}</h3>
            <p style="color:#888;">No events on this day.</p>
        `;
		return;
	}

	detailsPanel.innerHTML = `
        <h3>${dateStr}</h3>
        ${dayEvents.map(ev => `
            <div class="event-card">
                <strong>${ev.title}</strong><br/>
                <small>📅 ${ev.start.toString().split('T')[0]}</small>
		<p>
			${ev.delivery ? `🚗 ${ev.delivery}<br/>` : ''}
			${ev.time ? `🕑 ${ev.time}<br/>` : ''}
			${ev.location ? `📍 ${ev.location}<br/>` : ''}
			${ev.price ? `💸 ${ev.price}<br/>` : ''}
			${ev.description ? `📒 ${ev.description}<br/>` : ''}
		</p>
            </div>
        `).join('')}
    `;
}

function renderNextUpcomingEvent() {
	const allEvents = eventsService.getAll();
	const todayStr = new Date().toISOString().split('T')[0];

	const upcoming = allEvents
		.map(ev => ({ ...ev, startDate: ev.start.toString().split('T')[0] }))
		.filter(ev => ev.startDate >= todayStr)
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
            	<small>📅 ${next.start.toString().split('T')[0]}</small>
		<p>
			${next.delivery ? `🚗 ${next.delivery}` : ''}
			${next.time ? `🕑 ${next.time}` : ''}
			${next.description ? `📒 ${next.description}` : ''}
		</p>
        </div>
    `;
}

async function loadEvents() {
	//const res = await fetch('/api/events', { method: 'POST' });
	//const events = await res.json();
	const events = [
		{
			calendarId: 'Arnies',
			id: '1',
			title: 'Johns Cake',
			description: 'testing description',
			delivery: 'delivery',
			location: 'hells kitchen',
			time: '14:30',
			price: '500',
			start: '2026-07-23',
			end: '2026-07-23'
		},
		{
			calendarId: 'Arnies',
			id: '1',
			title: 'Mikes Cake',
			delivery: 'collection',
			start: '2026-07-23',
			end: '2026-07-23'
		},
		{
			calendarId: 'Arnies',
			id: '1',
			title: 'Johns Cake',
			start: '2026-07-23',
			end: '2026-07-23'
		},
		{
			calendarId: 'Arnies',
			id: '1',
			title: 'Johns Cake',
			start: '2026-07-24',
			end: '2026-07-24'
		},
		{
			calendarId: 'Arnies',
			id: '1',
			title: 'Johns Cake',
			start: '2026-07-25',
			end: '2026-07-25'
		},
		{
			calendarId: 'Arnies',
			id: '1',
			title: 'Johns Cake',
			start: '2026-07-25',
			end: '2026-07-25'
		}
	]

	events.forEach(ev => {
		calendar.eventsService.add(ev);
	});

	renderNextUpcomingEvent(); // refresh once, after all events are added
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
		const paidFullInput = createElement("input", { "id": "paidFull", "type": "checkbox", "onclick": 'paidReveal("paidFull")' }, "form-check-input mx-1 px-1");
		const paidFullLabel = createElement("label", { "for": "paidFull" }, "form-label", "Full");
		const paidDepositInput = createElement("input", { "id": "paidDeposit", "type": "checkbox", "onclick": 'paidReveal("paidDeposit")' }, "form-check-input mx-1 px-1");
		const paidDepositLabel = createElement("label", { "for": "paidDeposit" }, "form-label", "Deposit");
		const paidNoneInput = createElement("input", { "id": "paidNone", "type": "checkbox", "onclick": 'paidReveal("paidNone")'}, "form-check-input mx-1 px-1");
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
		const depositPaidLabel = createElement("label", { "for": "depositPaid" }, "form-label", "deposit Paid:");
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

function paidReveal(ID){
	const full = document.getElementById("paidFull");
	const deposit = document.getElementById("paidDeposit");
	const none = document.getElementById("paidNone");

	const depositPaidContainer = document.getElementById("depositPaidContainer");
	const depositPaidInput = document.getElementById("depositPaid");

	if(full.checked) {
		hide(depositPaidContainer);
		depositPaidInput.value = "";
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
		depositPaidInput.value = "";
		depositPaidInput.removeAttribute("required");
		full.disabled = true;
		deposit.disabled = true;
		none.disabled = false;
		return
	}

	depositPaidInput.value = "";
	depositPaidInput.removeAttribute("required");
	hide(depositPaidContainer);
	full.disabled = false;
	deposit.disabled = false;
	none.disabled = false;
	return

}