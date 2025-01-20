function getFlavours(){
    fetch('/api/flavours',{
        method: 'GET',
    })
    .then(response => {
        response.json().then(data =>{
            console.log(data.ID[0]);
			for(let i = 0; i < data.ID.length; i++) {
				createFlavours(data.Heading[i], data.Type[i], data.Text[i], data.Flavours[i])
			}
        })

    })
}

function createFlavours(heading, type, text, flavours){
	const container = document.getElementById("flavours");

	const items = createElement("div", {}, `row items m-0 p-0`);
	container.appendChild(items);

	const imageCon = createElement("div", {}, `col-6 sideImagesContainer m-0 p-0`);
	items.appendChild(imageCon);

	for(let i = 1; i <=2; i++){
		const imageWrapper = createElement("div", {}, `sideImages m-0 p-0`);
		imageCon.appendChild(imageWrapper);

		let image;

		if (heading === "Main") {
			image = createElement("img", {"loading":"lazy", "src":`./images/flavours/${type}/${i}.jpg`}, `img sideImage m-0 p-0`)
		} else if (heading === "Sub") {
			/*const check = document.getElementById()*/
			image = createElement("img", {"loading":"lazy", "src":`./images/flavours/Treats/${i}.jpg`}, `img sideImage m-0 p-0`)
		}

		imageWrapper.appendChild(image);
	}

	const itemWrapper = createElement("div", {}, `col-6 itemFlavours m-0 p-0`);
	items.appendChild(itemWrapper);

	if (heading === "Main") {
		const headingCon = createElement("div", {}, `col heading`);
		itemWrapper.appendChild(headingCon);

		const h2 = createElement("h2",{},``);
		h2.InnerHTML = heading;
		headingCon.appendChild(h2);

		for(let i = 0; i < text.length; i++){
			const text = createElement("div", {}, `row textAlign m-0 p-0`);
			itemWrapper.appendChild(text);

			const h4 = createElement("h4", {}, ``);
			h4.InnerHTML = text[i];
			text.appendChild(h4);
		}


	} else if (heading === "Sub") {
		console.log("Treats here");
	}
}


getFlavours();