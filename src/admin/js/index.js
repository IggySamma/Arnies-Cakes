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

				const deleteE = createElement('a', {onclick: "deleteEnquiry(this)"}, "");
				deleteE.innerHTML = "Delete";

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
	})
}

/*---------------- Calender System ---------------------------*/

const calendarDates = document.querySelector('.calendar-dates');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];


function renderCalendar(month, year) {
	calendarDates.innerHTML = '';
	monthYear.textContent = `${months[month]} ${year}`;

	var firstDay = new Date(year, month, 1).getDay();
	firstDay--;

	const daysInMonth = new Date(year, month +1, 0).getDate();
  
	// Create blanks for days of the week before the first day
	for (let i = 0; i < firstDay; i++) {
	  const blank = document.createElement('div');
	  calendarDates.appendChild(blank);
	}
  
	const today = new Date();

	// Populate the days
	for (let i = 1; i <= daysInMonth; i++) {
	  const day = document.createElement('div');
	  day.textContent = i;

	  if (
		i === today.getDate() &&
		year === today.getFullYear() &&
		month === today.getMonth()
	  ) {
		day.classList.add('current-date');
	  }

	  calendarDates.appendChild(day);
	}
  }

  renderCalendar(currentMonth, currentYear);

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
