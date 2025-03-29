//const { DatabaseSync } = require("node:sqlite");

let disabledDates = [];
let confirmedEnquirys = [];

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
	renderCalendar(currentMonth, currentYear);
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


function confirmEnquiry(enquiry){
	let id = enquiry.parentElement.parentElement.firstChild.innerHTML;
	console.log("Yes")
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

function declineEnquiry(enquiry){
	let id = enquiry.parentElement.parentElement.firstChild.innerHTML;
	console.log("Rejected")
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

	const headers = ["ID", "Date", "Link", "Action"];
	headers.forEach(heading => {
		const th = createElement('th', {}, "");
		th.innerHTML = heading;
		header.appendChild(th);
	})

	data.forEach( row => {
		if (row.Confirmed == 'No') {
			const tr = createElement('tr', {}, "");
			table.appendChild(tr);

			tableData = [row.ID, row.Date, row.Link, "Action"];
			tableData.forEach(column => {
				if(`${column}`.includes("https")){
					const td = createElement('td', {}, "");
					const a = createElement('a', {href: column, target: "_blank"}, "")
					a.innerHTML = "link"
					td.appendChild(a);
					tr.appendChild(td);
				} else if(`${column}`.includes("Action")){
					const td = createElement('td', {}, "");

					const confirm = createElement('a', {onclick: "confirmEnquiry(this)"}, "");
					confirm.innerHTML = "Confirm";

					const spacer = createElement('a', {}, "");
					spacer.innerHTML = " | ";

					const decline = createElement('a', {onclick: "declineEnquiry(this)"}, "");
					decline.innerHTML = "Decline";

					/*const deleteE = createElement('a', {onclick: "deleteEnquiry(this)"}, "");
					deleteE.innerHTML = "Delete";*/

					td.appendChild(confirm);
					td.appendChild(spacer);
					td.appendChild(decline);
					tr.appendChild(td);
				} else {
					const td = createElement('td', {}, "");
					td.innerHTML = column;
					tr.appendChild(td);
				}
			})
		} else if(row.Confirmed == 'Yes'){
			confirmedEnquirys.push(row)
		}
	})
	console.log(confirmedEnquirys)
	//Sequencing callbacks
	earliestOrderDate();
	console.log(earliestDate)
	fetchDisabledDates();
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
		let day// = createElement('div', {'id': nDate}, '', i);

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
	let div = createElement('div', {id: 'enq:' + data.ID, 'onclick': 'selectEnquiry(this)'}, 'rounded-5 enquiry m-0 p-1', data.Name)
	element.appendChild(div)	
	/*let div2 = createElement('div', {id: 'enq:' + data.ID}, 'rounded-5 enquiry m-0 p-1', data.Name)
	element.appendChild(div2)	
	let div3 = createElement('div', {id: 'enq:' + data.ID}, 'rounded-5 enquiry m-0 p-1', data.Name)
	element.appendChild(div3)*/
}


prevMonthBtn.addEventListener('click', () => {
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
