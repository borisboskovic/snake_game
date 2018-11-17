var currentName;
var defaultScore = 200;
var names = [];
var scores = [];
var leaderboards = document.getElementById("leaderboards");

//Dobavljanje podataka iz Lokalne memorije u nizove
function getFromMemory() {
	for (var i = 0; i < 10; i++) {
		names[i] = localStorage.getItem("name" + i);
		scores[i] = localStorage.getItem("scores" + i);
	}
}

//Upisivanje defaultnih vrijednosti u nizove ukoliko ne postoje u lokalnoj memoriji
function writeDefaults() {
	for (var i = 0; i < 10; i++) {
		if (names[i] == null && scores[i] == null) {
			names[i] = "player    "; //Dodata su četiri razmaka. Za stil koristimo white_space: pre;
			scores[i] = defaultScore;
		}
	}
}

//Ispisivanje nizova u dokument
function writeLeaderboards() {
	leaderboards.innerHTML = "Leaderboards:<br/>";
	for (var i = 0; i < 10; i++) {
		leaderboards.innerHTML += i + 1 + ":\t" + names[i] + " " + scores[i] + "<br />";
	}
}

//Upisivanje nove vrijednosti u niz
function insertScore(s, n) {
	for (var i = 0; i < 10; i++) {
		if (score > scores[i]) {
			for (var j = 9; j > i; j--) {
				scores[j] = scores[j - 1];
				names[j] = names[j - 1];
			}
			scores[i] = s;
			names[i] = n;
			break;
		}
	}
}

//Upisivanje podataka u lokalnu memoriju
function writeToMemory() {
	for (var i = 0; i < 10; i++) {
		localStorage.setItem("name" + i, names[i]);
		localStorage.setItem("scores" + i, scores[i]);
	}
}

getFromMemory();
writeDefaults();
writeLeaderboards();

function updateLeaderboards() {
	if (score <= defaultScore)
		return 0;
	swal({
		title: 'WOW, it\'s a HighScore!\nTell us your name.',
		input: 'text',
		showCancelButton: false,
		inputValidator: function(value) {
			return new Promise(function(resolve, reject) {
				if (value.length >= 3 && value.length <= 10) {
					currentName = value;
					for (i = currentName.length; i < 10; i++)
						currentName += " ";
					insertScore(score, currentName);
					writeToMemory();
					writeLeaderboards();
					resolve()
				} else {
					reject('Your name should be between 3 and 10 characters long!')
				}
			})
		}
	}).then(function(result) {
		swal({
			type: 'success',
			html: 'Thank you ' + result
		})
	});
}