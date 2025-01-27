function show(){
	update = document.querySelectorAll('*');
	hide = document.getElementById('loading')
	update.forEach( element => {
		element.style.visibility = 'visible'
	})
	hide.style.visibility = 'hidden';
	hide.style.display = 'none';
}