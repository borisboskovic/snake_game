document.getElementById("timer").innerHTML = "00:00";
var seconds = 0;
var minutes = 0;

function timer() {
	if (!pause && alive)
		seconds += 1;
	if (seconds == 60) {
		seconds = 0;
		minutes++;
	}
	document.getElementById("timer").innerHTML = minutes.formatScore(2) + ":" + seconds.formatScore(2);
}

setInterval(timer, 1000);