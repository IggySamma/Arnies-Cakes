function getFlavours(){
    fetch('/api/flavours',{
        method: 'GET',
    })
    .then(response => {
        response.json().then(data =>{
			for(let i = 0; i < data.ID.length; i++) {
				createFlavours(data.Heading[i], data.Type[i], data.Text[i], data.Flavours[i])
			}
			createFlavours("OrderNow")
        })

    })
}

function createFlavours(heading, type, text, flavours){
	const container = document.getElementById("flavours");

	if (heading === "Main") {
		const items = createElement("div", {}, `row items m-0 p-0`);
		container.appendChild(items);

		const imageCon = createElement("div", {}, `col-6 sideImagesContainer m-0 p-0`);
		items.appendChild(imageCon);

		const imageWrapper = createElement("div", {}, `sideImages m-0 p-0`);
		imageCon.appendChild(imageWrapper);

		const image = createElement("img", {"loading":"lazy", "src":`./images/flavours/${type}/1.jpg`}, `img sideImage m-0 p-0`)

		imageWrapper.appendChild(image);

		const imageWrapper2 = createElement("div", {}, `sideImages m-0 p-0`);
		imageCon.appendChild(imageWrapper2);

		const image2 = createElement("img", {"loading":"lazy", "src":`./images/flavours/${type}/2.jpg`}, `img sideImage m-0 p-0`)

		imageWrapper2.appendChild(image2);

		const itemWrapper = createElement("div", {}, `col-6 itemFlavours m-0 p-0`);
		items.appendChild(itemWrapper);

		const headingCon = createElement("div", {}, `col heading`);
		itemWrapper.appendChild(headingCon);

		const h2 = createElement("h2",{},``);
		h2.innerHTML = type;
		headingCon.appendChild(h2);

		for(let i = 0; i < text.length; i++){
			const textWrapper = createElement("div", {}, `row textAlign m-0 p-0`);
			itemWrapper.appendChild(textWrapper);

			const h4 = createElement("h4", {}, ``);
			h4.innerHTML = text[i];
			textWrapper.appendChild(h4);
		}

		const sep = createElement("div", {}, `col heading2`);
		itemWrapper.appendChild(sep);

		const sepText = createElement("h3", {}, ``);
		sepText.innerHTML = "Flavours:";
		sep.appendChild(sepText);

		for(let i = 0; i < flavours.length; i++){
			//console.log(flavours[i]);
			const textWrapper = createElement("div", {}, `row textAlign m-0 p-0`);
			itemWrapper.appendChild(textWrapper);
			
			const h4 = createElement("h4", {}, ``);
			h4.innerHTML = flavours[i];
			textWrapper.appendChild(h4);
		}

		const textWrapper = createElement("div", {}, `row textAlign m-0 p-0`);
		itemWrapper.appendChild(textWrapper);

		const h4 = createElement("h4", {}, ``);
		h4.innerHTML = "hidden";
		h4.style.visibility = "hidden";
		textWrapper.appendChild(h4);
	} else if (heading === "Sub") {

		let items = document.getElementById("treatsItem")
		if (items === null || items === undefined) {
			items = createElement("div", {"id":"treatsItem"}, `row items m-0 p-0`);
			container.appendChild(items);
		}

		let imageCon = document.getElementById("treats")

		if (imageCon === null || imageCon === undefined ) {
			imageCon = createElement("div", {"id":"treats"}, `col-6 sideImagesContainer m-0 p-0`);
			items.appendChild(imageCon);

			const imageWrapper = createElement("div", {}, `sideImages m-0 p-0`);
			imageCon.appendChild(imageWrapper);

			const image = createElement("img", {"loading":"lazy", "src":`./images/flavours/Treats/1.jpg`}, `img sideImage m-0 p-0`)

			imageWrapper.appendChild(image);

			const imageWrapper2 = createElement("div", {}, `sideImages m-0 p-0`);
			imageCon.appendChild(imageWrapper2);

			const image2 = createElement("img", {"loading":"lazy", "src":`./images/flavours/Treats/2.jpg`}, `img sideImage m-0 p-0`)

			imageWrapper2.appendChild(image2);
		}

		let itemWrapper = document.getElementById("itemWrapper")
		let headingCon = document.getElementById("itemsHeading");
		
		if (headingCon === null || headingCon === undefined){
			itemWrapper = createElement("div", {"id":"itemWrapper"}, `col-6 itemFlavours m-0 p-0`);
			items.appendChild(itemWrapper);

			headingCon = createElement("div", {"id":"itemsHeading"}, `col heading`);
			itemWrapper.appendChild(headingCon);

			const h2 = createElement("h2",{},``);
			h2.innerHTML = "Treats:";
			headingCon.appendChild(h2);
		}

		for(let i = 0; i < text.length; i++){
			const textWrapper = createElement("div", {}, `row textAlign m-0 p-0`);
			itemWrapper.appendChild(textWrapper);
			
			const h4 = createElement("h4", {}, ``);
			h4.innerHTML = type[i] + ": " + text[i];
			textWrapper.appendChild(h4);
		}


	} else if (heading == "OrderNow") {
			let itemWrapper = document.getElementById("itemWrapper")

			const textWrapper = createElement("div", {}, `row textAlign m-0 p-0`);
			itemWrapper.appendChild(textWrapper);
	
			const h4 = createElement("h4", {}, ``);
			h4.innerHTML = "hidden";
			h4.style.visibility = "hidden";
			textWrapper.appendChild(h4);

			const sep = createElement("div", {}, `col heading2`);
			itemWrapper.appendChild(sep);

			const a = createElement("a", {"href":"./Enquiries"}, ``);
			sep.appendChild(a)
	
			const sepText = createElement("h3", {"href":"./Enquiries"}, ``);
			sepText.innerHTML = "Order Now!";
			a.appendChild(sepText);
	}
}


getFlavours();