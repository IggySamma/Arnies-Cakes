let time = document.getElementById("timer");
time.innerHTML = 15;

function timer(){
	setTimeout(() => {
		if (time.innerHTML -1 == -1) {
			window.location.href = "./"
		} else {
			time.innerHTML = time.innerHTML -1
		}
		timer();
	}, 1000)
}
