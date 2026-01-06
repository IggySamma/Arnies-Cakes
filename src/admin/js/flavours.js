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
	fetch('/api/flavours', {
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

	fetch('/api/mainheaderstest', {
		method: 'POST',
	})
};

function updateContainer(flavour){
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


	/*const segCon = createElement('div', {}, "row itemWrapper g-3 mb-1")
	updateCon.appendChild(segCon)
	segCon.appendChild(createElement('label', {}, "form-label mb-1", Type))
	segCon.appendChild(createElement('input', {'id': `${Type}CheckBox`, 'type':'checkbox'}, "form-check-input CheckBox"))
	segCon.appendChild(createElement('label', {}, "form-check-label mx-1 px-1 mb-1", "Update " + Type))
	segCon.appendChild(createElement('textarea', { 'type': 'text', 'placeholder': Type }, "form-control-m mb-1", Type))
	if(Heading === "Main"){
		segCon.appendChild(createElement('input', { 'id': `${Flavours}CheckBox`, 'type': 'checkbox' }, "form-check-input CheckBox"))
		segCon.appendChild(createElement('textarea', { 'type': 'text', 'placeholder': Flavours }, "form-control mb-1", Flavours))
	}
	segCon.appendChild(createElement('input', { 'id': `${Text}CheckBox`, 'type': 'checkbox' }, "form-check-input CheckBox"))
	segCon.appendChild(createElement('textarea', { 'type': 'text', 'placeholder': Text }, "form-control mb-1", Text))*/
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
	console.log(type)
	if(type.Type !== 'Cakes') {
		segCon.appendChild(createElement('input', { 'id': `${type.Type}CheckBoxUpdate`, 'type': 'checkbox', 'onclick': `enableTextBox('${type.Type}')` }, "form-check-input CheckBox"));
		segCon.appendChild(createElement('label', { 'for': `${type.Type}CheckBoxUpdate` }, "form-check-label m-0", "Update Name"));
	} else {
		segCon.appendChild(createElement('label', { 'for': `${type.Type}CheckBoxUpdate` }, "form-check-label m-0", "Cakes name cannot be updated."));
	}
	segCon.appendChild(createElement('textarea', { 'type': 'text', 'id': `${type.Type}TextBoxUpdate`, 'placeholder': type.Type, 'disabled': ''}, "form-control-m mb-1", type.Type));

	if (type.Heading === "Main") {
		segCon.appendChild(createElement('input', { 'id': `${type.Flavours}CheckBoxUpdate`, 'type': 'checkbox', 'onclick': `enableTextBox('${type.Flavours}')` }, "form-check-input CheckBox"));
		segCon.appendChild(createElement('label', { 'for': `${type.Flavours}CheckBoxUpdate` }, "form-check-label m-0 mx-1 px-1 mb-1", "Update Flavours"));
		segCon.appendChild(createElement('textarea', { 'type': 'text', 'id': `${type.Flavours}TextBoxUpdate`, 'placeholder': type.Flavours, 'disabled': '' }, "form-control mb-1", type.Flavours));
	}
	segCon.appendChild(createElement('input', { 'id': `${type.Text}CheckBoxUpdate`, 'type': 'checkbox', 'onclick': `enableTextBox('${type.Text}')` }, "form-check-input CheckBox"));
	segCon.appendChild(createElement('label', { 'for': `${type.Text}CheckBoxUpdate` }, "form-check-label m-0 mx-1 px-1 mb-1", "Update Text"));
	segCon.appendChild(createElement('textarea', { 'type': 'text', 'id': `${type.Text}TextBoxUpdate`, 'placeholder': type.Text, 'disabled': '' }, "form-control mb-1", type.Text));
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