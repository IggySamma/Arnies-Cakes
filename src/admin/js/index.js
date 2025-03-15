function getAllEnquiries() {
    fetch('/api/allEnquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
		displayEnquiries(data.reverse());
    })
    /*.catch(error => {
        console.error("Error fetching enquiries:", error);
    });*/
}

function displayEnquiries(data){
	const table = document.getElementById("enquiries");

	const header = createElement('tr', {}, "");
	table.appendChild(header);

	const headers = ["ID", "Date", "Link", "Confirm ?"];
	headers.forEach(heading => {
		const th = createElement('th', {}, "");
		th.innerHTML = heading;
		header.appendChild(th);
	})

	data.forEach( row => {
		const tr = createElement('tr', {}, "");
		table.appendChild(tr);

		tableData = [row.ID, row.Date, row.Link, "Confirm Order"];
		tableData.forEach(column => {
			if(`${column}`.includes("https")){
				const td = createElement('td', {}, "");
				const a = createElement('a', {href: column}, "")
				a.innerHTML = "link"
				td.appendChild(a);
				tr.appendChild(td);
			} else {
				const td = createElement('td', {}, "");
				td.innerHTML = column;
				tr.appendChild(td);
			}
		})
	})
}