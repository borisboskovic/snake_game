//Ispraviti tailColision (Gubi se jedan blok)
//Ispraviti generisanje novog bloka (generiše se i u repu)
//Instalirati SweetAlert i jQuery preko npm (Ne zaboravi prepraviti linkove u HTMLu)
//Možda će biti potrebno koristiti neki monospace font za leaderboards
//Pokušati izmijeniti da kontrole idu preko EventListenera i da se koristi onkeypress umjesto onkeydown, da bi se spriječilo ubrzavanje
//Dodati dugme za New Game
//Refaktorisati kod

//Osnovne postavke
//Veličina stola mora biti djeljiva sa veličinom kvadratića, u suprotnom će doći do nepredviđenih rezultata
var tableSizeHorizontal = 495;
var tableSizeVertical = 495;
var squareSize = 15;

var snakeLength = 3;
var headPositionHorizontal = (snakeLength - 1) * squareSize;
var headPositionVertical = 0;
var alive = true;
var speed = 110;
var maxSpeed = 65;
var speedIndicator = 1;
var score = 0;

Number.prototype.formatScore = function(n) {
	var numberOfDigits = 1;
	var number = this;
	do {
		number = Math.floor(number / 10);
		if (number > 0)
			numberOfDigits++;
		else
			break;
	} while (true);
	number = this;
	for (var i = 0; i < n - numberOfDigits; i++)
		number = "0" + number;
	return number;
}

//Funkcija za kreiranje bloka
function createBlock(verticalPosition, horizontalPosition, id_number) {
	var newBlock = document.createElement("div");
	newBlock.id = "box" + id_number;
	newBlock.style.width = squareSize + "px";
	newBlock.style.height = squareSize + "px";
	newBlock.style.position = "absolute";
	newBlock.style.backgroundColor = "black";
	newBlock.style.background = "radial-gradient(#999, #555 20%, #000 50%)";
	newBlock.style.borderRadius = "4px";
	newBlock.style.top = verticalPosition * squareSize + "px";
	newBlock.style.left = horizontalPosition * squareSize + "px";
	document.getElementById("container").appendChild(newBlock);
}

//Funkcija za postavljanje hrane
function placeFood() {
	do {
		var overlap = false;
		var foodHorizontal = Math.round(Math.random() * (tableSizeHorizontal / squareSize - 1));
		var foodVertical = Math.round(Math.random() * (tableSizeVertical / squareSize - 1));
		for (var i = 0; i < snakeLength; i++) {
			if ((snake[i].style.left == (foodHorizontal * 15 + "px")) && (snake[i].style.top == (foodVertical * 15 + "px"))) {
				overlap = true;
				break;
			}
		}
	} while (overlap);
	createBlock(foodVertical, foodHorizontal, snakeLength);
}

//Funkcija za kraj igre
function death() {
	alive = false;
	clearInterval(movingLeft);
	clearInterval(movingRight);
	clearInterval(movingDown);
	clearInterval(movingUp);
	document.getElementById("game_over").style.visibility = "visible";
	return updateLeaderboards();
}

//Funkcija za provjeru sudara sa repom zmije
function checkTailCollision() {
	for (var i = 0; i < snakeLength - 2; i++) {
		if (document.getElementById("box" + i).style.left == document.getElementById("box" + (snakeLength - 1)).style.left && document.getElementById("box" + i).style.top == document.getElementById("box" + (snakeLength - 1)).style.top) {
			death();
		}
	}
}

//Inicijalizacija igre
function startGame() {
	createBlock(0, 0, 0);
	createBlock(0, 1, 1);
	createBlock(0, 2, 2);
	document.getElementById("container").style.width = tableSizeHorizontal + "px";
	document.getElementById("container").style.height = tableSizeVertical + "px";
	document.getElementById("sidebox").style.height = tableSizeVertical + "px";
	document.getElementById("score").innerHTML = score.formatScore(5);
	document.getElementById("speed").innerHTML = 10;
	document.getElementById("speed").innerHTML = "0" + speedIndicator;
}

startGame();

var snake = [
	document.getElementById("box0"),
	document.getElementById("box1"),
	document.getElementById("box2")
];

placeFood();


//Funkcije za kretanje
function moveSnake() {
	for (var i = 0; i < snakeLength - 1; i++) {
		document.getElementById("box" + i).style.left = document.getElementById("box" + (i + 1)).style.left;
		document.getElementById("box" + i).style.top = document.getElementById("box" + (i + 1)).style.top;
	}
}

function moveRight() {
	checkTailCollision();
	if (!alive)
		return 0;
	if (headPositionHorizontal <= tableSizeHorizontal - squareSize * 2) {
		moveSnake();
		headPositionHorizontal += squareSize;
		snake[snakeLength - 1].style.left = headPositionHorizontal + "px";
		feed();
	} else if (headPositionHorizontal == tableSizeHorizontal - squareSize)
		death();
}

function moveLeft() {
	checkTailCollision();
	if (!alive)
		return 0;
	if (headPositionHorizontal >= squareSize) {
		moveSnake();
		headPositionHorizontal -= squareSize;
		snake[snakeLength - 1].style.left = headPositionHorizontal + "px";
		feed();
	} else if (headPositionHorizontal == 0)
		death();
}

function moveDown() {
	checkTailCollision();
	if (!alive)
		return 0;
	if (headPositionVertical <= tableSizeVertical - squareSize * 2) {
		moveSnake();
		headPositionVertical += squareSize;
		snake[snakeLength - 1].style.top = headPositionVertical + "px";
		feed();
	} else if (headPositionVertical == tableSizeVertical - squareSize)
		death();
}

function moveUp() {
	checkTailCollision();
	if (!alive)
		return 0;
	if (headPositionVertical >= squareSize) {
		moveSnake();
		headPositionVertical -= squareSize;
		snake[snakeLength - 1].style.top = headPositionVertical + "px";
		feed();
	} else if (headPositionVertical == 0)
		death();
}

function feed() {
	if (snake[snakeLength - 1].style.left == document.getElementById("box" + snakeLength).style.left && snake[snakeLength - 1].style.top == document.getElementById("box" + snakeLength).style.top) {
		snake[snakeLength] = document.getElementById("box" + snakeLength);
		snakeLength++;
		score += speedIndicator;
		if ((snakeLength - 3) % 10 == 0 && speed > maxSpeed) {
			speed -= 5;
			speedIndicator += 1;
		}
		document.getElementById("score").innerHTML = score.formatScore(5);
		document.getElementById("speed").innerHTML = speedIndicator.formatScore(2);
		placeFood();
	}
}



//Kontrole
var movingRight;
var movingLeft;
var movingDown;
var movingUp;
var alive = true;
var isMovingRight = false;
var isMovingLeft = false;
var isMovingDown = false;
var isMovingUp = false;
var pause = true;
var pausedDirection;

if (alive) {
	document.addEventListener("keydown", function(event) {
		switch (event.keyCode) {
			//PAUSE
			case 32:
				if (!pause && alive) {
					pause = true;
					clearInterval(movingRight);
					clearInterval(movingLeft);
					clearInterval(movingDown);
					clearInterval(movingUp);
					document.getElementById("pause").style.visibility = "visible";
				}
				break;

				//moving LEFT
			case 37:
				pause = false;
				document.getElementById("pause").style.visibility = "hidden";
				if (!movingRight && !movingLeft && !movingDown && !movingUp) {
					isMovingRight = true;
					movingRight = setInterval(moveRight, speed);
					break;
				}
				clearInterval(movingRight);
				clearInterval(movingLeft);
				clearInterval(movingDown);
				clearInterval(movingUp);
				isMovingDown = false;
				isMovingUp = false;
				if (isMovingRight) {
					isMovingLeft = false;
					movingRight = setInterval(moveRight, speed);
				} else {
					isMovingLeft = true;
					isMovingRight = false;
					moveLeft();
					movingLeft = setInterval(moveLeft, speed);
				}
				break;

				//moving UP
			case 38:
				pause = false;
				document.getElementById("pause").style.visibility = "hidden";
				if (!movingRight && !movingLeft && !movingDown && !movingUp) {
					isMovingRight = true;
					movingRight = setInterval(moveRight, speed);
					break;
				}
				clearInterval(movingRight);
				clearInterval(movingLeft);
				clearInterval(movingDown);
				clearInterval(movingUp);
				isMovingRight = false;
				isMovingLeft = false;
				if (isMovingDown) {
					isMovingUp = false;
					movingDown = setInterval(moveDown, speed);
				} else {
					isMovingUp = true;
					isMovingDown = false;
					moveUp();
					movingUp = setInterval(moveUp, speed);
				}
				break;

				//moving RIGHT
			case 39:
				pause = false;
				document.getElementById("pause").style.visibility = "hidden";
				clearInterval(movingRight);
				clearInterval(movingLeft);
				clearInterval(movingDown);
				clearInterval(movingUp);
				isMovingDown = false;
				isMovingUp = false;
				if (isMovingLeft) {
					isMovingRight = false;
					movingLeft = setInterval(moveLeft, speed);
				} else {
					isMovingRight = true;
					isMovingLeft = false;
					moveRight();
					movingRight = setInterval(moveRight, speed);
				}
				break;

				//moving DOWN
			case 40:
				pause = false;
				document.getElementById("pause").style.visibility = "hidden";
				if (!movingRight && !movingLeft && !movingDown && !movingUp) {
					isMovingRight = true;
					movingRight = setInterval(moveRight, speed);
					break;
				}
				clearInterval(movingRight);
				clearInterval(movingLeft);
				clearInterval(movingDown);
				clearInterval(movingUp);
				isMovingRight = false;
				isMovingLeft = false;
				if (isMovingUp) {
					isMovingDown = false;
					movingUp = setInterval(moveUp, speed);
				} else {
					isMovingDown = true;
					isMovingUp = false;
					moveDown();
					movingDown = setInterval(moveDown, speed);
				}
				break;
		}
	});
}