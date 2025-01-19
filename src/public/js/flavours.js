function getMainHeaders(){
    let mainHeadings;
    fetch('/api/getMainHeaders',{
        method: 'POST',
    })
    .then(response => {
        response.json().then(data =>{
            mainHeadings = data
			console.log(mainHeadings)
            for(let i = 0; i < mainHeadings.length; i++){
                tempFlavs = mainHeadings[i].Flavours.split(",")
                let flavours = [];
                for(let j = 0; j < tempFlavs.length; j++){
                    flavours.push(tempFlavs[j].replace("[","").replace("]","").replace('"',"").replace('"',"").replace(" ",""))
                }
				console.log(mainHeadings[i])
                createHeaders(mainHeadings[i].Type, "flavoursContent", flavours, true);
            }
        })
		getTreatsHeaders();
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
                createHeaders(treatsHeadings[i].Type, "flavoursContent", "", false);
            }
        })
    })
}

function createHeaders(item, heading, flavours, includeFlavours) {
    const header = document.getElementById(heading);

	if (includeFlavours){
		const div = createElement("div", { id: item }, `${item}Flavours m-2 p-2`);
		header.appendChild(div);

		const span = createElement("span", {},``);
		div.appendChild(span)

		const h1 = createElement("h2", {}, ``);
		h1.innerHTML = item + ":";
		span.appendChild(h1);

		for(let i=0; i < flavours.length; i++){
			const h4 = createElement("h4", {}, `ms-3 p-1`);
			h4.innerHTML = flavours[i] + `<br>`
			span.appendChild(h4);
		}
	} else {
		let newHeader = document.getElementById("additionalItems");

		if(newHeader === null){
			newHeader = createElement("div", {id: "additionalItems"},`m-2 p-2`);
			header.appendChild(newHeader);

			const span = createElement("span", {id: "spanItems"},``);
			newHeader.appendChild(span)
	
			const h1 = createElement("h2", {}, ``);
			h1.innerHTML = "Addition items";
			span.appendChild(h1);
		}
		
		const span = document.getElementById("spanItems");

		const h4 = createElement("h4", {}, `ms-3 p-1`);
		h4.innerHTML = item + `<br>`
		span.appendChild(h4);
	}
}

//getMainHeaders();