//const { createElement } = require("react");

let control = document.getElementById("actionInput");
let controlContainers = [
	"Update"
	,"Delete"
	,"Create"
];

control.addEventListener("change", function() {
	controlContainers.forEach( id => {
		document.getElementById(id).style.display = "none";
	})
	document.getElementById(control.value).style.display = "block";
});

let flavours = [];


function getFlavours() {
	/*fetch('/api/flavours', {
		method: 'GET',
	})
	.then(response => {
		response.json().then(data => {
			for (let i = 0; i < data.ID.length; i++) {
				flavours.push({ Heading: data.Heading[i], Type: data.Type[i], Text: data.Text[i], Flavours: data.Flavours[i] });
				//console.log(data.Heading[i], data.Type[i], data.Text[i], data.Flavours[i])
				
			}
			updateContainer(flavours);
		});
	});
	*/
	fetch('/api/adminSelect', {
		method: 'POST',
	}).then(response => {
		response.json().then(data => {
			for (let i = 0; i < data.length; i++) {
				flavours.push({ 
					Heading: data[i].Heading,
					Type: data[i].Type,
					Text: data[i].Text, 
					Flavours: JSON.parse(data[i].Flavours),
					HID: data[i].hID,
					MinOrder: data[i].minOrder, 
					Step: data[i].step
				});
			}
			updateContainer(flavours);
		})
	}

	)
};

function updateContainer(flavour){
	console.log(flavour)
	const updateCon = document.getElementById("Update");
	const selCon = createElement('select', { 'id': 'updateSelect' }, "form-select");
	updateCon.appendChild(selCon);
	selCon.appendChild(createElement('option', {'selected':''}, "", "Select name you want to update"));
	flavour.forEach(types => {
		selCon.appendChild(createElement('option', { 'value': types.Type }, "", "Update " + types.Type));
	});

	let updateSelect = document.getElementById("updateSelect");
	updateSelect.addEventListener("change", function () {
		updateFiltered();
	});

}

function updateFiltered(){
	const updateCon = document.getElementById("Update");
	let updateSelect = document.getElementById("updateSelect");
	if(document.getElementById('updateContainer') !== null){
		document.getElementById('updateContainer').remove();
	}
	const segCon = createElement('div', {'id':'updateContainer'}, "row itemWrapper g-3 mt-2 mb-1");
	updateCon.appendChild(segCon);

	segCon.appendChild(createElement('h5', {}, "form-label mt-1 p-0 text-danger", "Anything enabled will get updated on submit"))
	segCon.appendChild(createElement('h5', {}, "form-label m-0 p-0 mb-1 text-info", "Seperate new text by commas ','"))

	let type = flavours.find(item => item.Type.includes(updateSelect.value));

	const splitCon = createElement('div', {'id':'splitContainer'}, "row columnWrapper g-0 m-0 p-0");
	const leftCon = createElement('div', { 'id': 'leftContainer' }, "col col-9 g-0 m-0 p-0");
	const rightCon = createElement('div', { 'id': 'rightContainer' }, "col col-3 g-0 m-0 p-0");

	segCon.appendChild(splitCon);
	splitCon.appendChild(leftCon);
	splitCon.appendChild(rightCon);

	const typeCon = createElement('div', { 'id': 'typeContainer' }, "row g-1 m-1 p-1");
	const flavourCon = createElement('div', { 'id': 'flavourContainer' }, "row g-1 m-1 p-1");
	const textCon = createElement('div', { 'id': 'textContainer' }, "row g-1 m-1 p-1");
	const minOrderCon = createElement('div', { 'id': 'minOrderContainer' }, "row g-1 m-1 p-1");
	const stepCon = createElement('div', { 'id': 'stepContainer' }, "row g-1 m-1 p-1");
	const submitCon = createElement('div', { 'id': 'submitContainer' }, "row-3 g-1 m-1 p-1");

	leftCon.appendChild(typeCon);
	leftCon.appendChild(flavourCon);
	leftCon.appendChild(textCon);

	rightCon.appendChild(minOrderCon);
	rightCon.appendChild(stepCon);
	rightCon.appendChild(submitCon);


	if(type.Type !== 'Cakes') {
		typeCon.appendChild(createElement('input', { 'id': 'TypeCheckBoxUpdate', 'type': 'checkbox', 'onclick': `enableTextBox('Type')` }, "form-check-input CheckBox"));
		typeCon.appendChild(createElement('label', { 'for': 'TypeCheckBoxUpdate' }, "form-check-label m-0", "Update Name"));
	} else {
		typeCon.appendChild(createElement('label', { 'for': 'TypeCheckBoxUpdate' }, "form-check-label m-0", "Cakes name cannot be updated."));
	}
	typeCon.appendChild(createElement('textarea', { 'type': 'text', 'id': 'TypeTextBoxUpdate', 'placeholder': type.Type, 'disabled': ''}, "form-control-m mb-1", type.Type));

	if (type.Heading === "Main") {
		flavourCon.appendChild(createElement('input', { 'id': 'FlavoursCheckBoxUpdate', 'type': 'checkbox', 'onclick': `enableTextBox('Flavours')` }, "form-check-input CheckBox"));
		flavourCon.appendChild(createElement('label', { 'for': 'FlavoursCheckBoxUpdate' }, "form-check-label m-0 mx-1 px-1 mb-1", "Update Flavours"));
		flavourCon.appendChild(createElement('textarea', { 'type': 'text', 'id': 'FlavoursTextBoxUpdate', 'placeholder': type.Flavours, 'disabled': '' }, "form-control mb-1", type.Flavours));
	}

	textCon.appendChild(createElement('input', { 'id': 'TextCheckBoxUpdate', 'type': 'checkbox', 'onclick': `enableTextBox('Text')` }, "form-check-input CheckBox"));
	textCon.appendChild(createElement('label', { 'for': 'TextCheckBoxUpdate' }, "form-check-label m-0 mx-1 px-1 mb-1", "Update Text"));
	textCon.appendChild(createElement('textarea', { 'type': 'text', 'id': 'TextTextBoxUpdate', 'placeholder': type.Text, 'disabled': '' }, "form-control mb-1", type.Text));

	minOrderCon.appendChild(createElement('input', { 'id': 'MinOrderCheckBoxUpdate', 'type': 'checkbox', 'onclick': `enableTextBox('MinOrder')` }, "form-check-input CheckBox"));
	minOrderCon.appendChild(createElement('label', { 'for': 'MinOrderCheckBoxUpdate' }, "form-check-label m-0 mx-1 px-1 mb-1", "Update Min Order amount"));
	minOrderCon.appendChild(createElement('input', { 'type': 'number', 'id': 'MinOrderTextBoxUpdate', 'placeholder': type.MinOrder, 'step': `${type.Step}`, 'value': `${type.MinOrder}`, 'disabled': '' }, "form-control mb-1", type.MinOrder));

	stepCon.appendChild(createElement('input', { 'id': 'StepCheckBoxUpdate', 'type': 'checkbox', 'onclick': `enableTextBox('Step')` }, "form-check-input CheckBox"));
	stepCon.appendChild(createElement('label', { 'for': 'StepCheckBoxUpdate' }, "form-check-label m-0 mx-1 px-1 mb-1", "Update increment for min order"));
	stepCon.appendChild(createElement('input', { 'type': 'number', 'id': 'StepTextBoxUpdate', 'placeholder': type.Step, 'step':'0.1', 'value':`${type.Step}`, 'disabled': '' }, "form-control mb-1", type.Step));

	submitCon.appendChild(createElement('button', { 'id': 'submit' }, "btn btn-primary mb-3 p-2", "Submit"));

}

function enableTextBox(id){
	let checkbox = document.getElementById(id + "CheckBoxUpdate");
	let textbox = document.getElementById(id + "TextBoxUpdate")
	if (checkbox.checked){
		textbox.removeAttribute("disabled");
	} else {
		textbox.setAttribute("disabled", "");
	}
}