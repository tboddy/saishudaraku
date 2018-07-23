let gameClock = 0, logged = false, fpsStart = 0, fpsFrame = 0, currentFps = 0, gameOver = false, savedData = {}, finishedGame = false,
	currentScore = 0, highScore = 0;

const canvas = document.getElementById('canvas'), canvasEl = $('canvas'), grid = 16, gameWidth = 240, gameHeight = 320, introTime = 0,
	{app} = require('electron').remote, browserWindow = require('electron').remote, storage = require('electron-json-storage'),
	context = canvas.getContext('2d'), mainWindow = browserWindow.getCurrentWindow(),

colors = {
	purple: '#442434',
	blueLight: '#6dc2ca',
	blue: '#597dce',
	blueDark: '#30346d',
	green: '#6daa2c',
	greenDark: '#346524',
	red: '#d04648',
	peach: '#d2aa99',
	light: '#deeed6',
	dark: '#140c1c',
	purple: '#442434',
	orange: '#d27d2c',
	yellow: '#dad45e'
},

getAspect = () => {
	var newWidth = $(window).width(), newHeight = $(window).height(), remHeight = $(window).width() * (1 + 1 / 3),
		remWidth = $(window).height() * 0.75;
	if(newWidth >= remWidth) newWidth = remWidth;
	else if(newHeight > remHeight) newHeight = remHeight;
	return {width: newWidth, height: newHeight};
},

resizeGame = () => {
	var canvasWidth = getAspect().width, canvasHeight = getAspect().height;
	canvasEl.css('width', canvasWidth + 'px').css('height', canvasHeight + 'px').css('margin-left', -(canvasWidth / 2) + 'px').css('margin-top', -(canvasHeight / 2) + 'px');
},

clearGame = () => {
	resizeGame();
	context.clearRect(0, 0, getAspect().width, getAspect().height);
},

drawRect = (x, y, width, height, color) => {
	context.beginPath();
	context.rect(x, y, width, height);
	context.fillStyle = color;
	context.fill();
},

drawImg = (img, dx, dy, dWidth, dHeight, rotate) => {
	if(dWidth && dHeight) context.drawImage(img, dx, dy, dWidth, dHeight);
	else context.drawImage(img, dx, dy);
},

randomId = () => {
	return Math.floor(Math.random() * 50000) + 1;
},

getAngle = (a, b) => {
	const angle = Math.atan2((a.position.y + a.size.y / 2) - (b.position.y + b.size.y / 2), (a.position.x + a.size.x / 2) - (b.position.x + b.size.x / 2));
	return angle;
},

checkCollision = function(elA, elB, callback){
	if(elA.x <= elB.x + elB.width &&
		elA.x + elA.width >= elB.x &&
		elA.y <= elB.y + elB.height &&
		elA.y + elA.height >= elB.y){
		callback(elA, elB);
	}
},

utilities = {

	drawString(input, x, y, isAlt){
		const drawChar = (input, x) => {
			let charLeft = 0;
			const size = 9, sizeY = 17, charY = isAlt ? sizeY	: 0;
			switch(input){
				// case '0': charLeft = numStart; break;
				case '!': charLeft = size; break;
				case '"': charLeft = size * 2; break;
				case '#': charLeft = size * 3; break;
				case '$': charLeft = size * 4; break;
				case '%': charLeft = size * 4; break;
				case '&': charLeft = size * 5; break;
				case '\'': charLeft = size * 7; break;
				case '(': charLeft = size * 7; break;
				case ')': charLeft = size * 8; break;
				case '*': charLeft = size * 10; break;
				case '+': charLeft = size * 11; break;
				case ',': charLeft = size * 12; break;
				case '-': charLeft = size * 12; break;
				case '.': charLeft = size * 13; break;
				case '/': charLeft = size * 14; break;
				case '0': charLeft = size * 15; break;
				case '1': charLeft = size * 16; break;
				case '2': charLeft = size * 17; break;
				case '3': charLeft = size * 18; break;
				case '4': charLeft = size * 19; break;
				case '5': charLeft = size * 20; break;
				case '6': charLeft = size * 21; break;
				case '7': charLeft = size * 22; break;
				case '8': charLeft = size * 23; break;
				case '9': charLeft = size * 24; break;
				case ':': charLeft = size * 25; break;
				case ';': charLeft = size * 27; break;
				case '<': charLeft = size * 28; break;
				case '=': charLeft = size * 29; break;
				case '>': charLeft = size * 30; break;
				case '?': charLeft = size * 31; break;
				case '@': charLeft = size * 32; break;
				case 'A': charLeft = size * 32; break;
				case 'B': charLeft = size * 33; break;
				case 'C': charLeft = size * 34; break;
				case 'D': charLeft = size * 35; break;
				case 'E': charLeft = size * 36; break;
				case 'F': charLeft = size * 37; break;
				case 'G': charLeft = size * 38; break;
				case 'H': charLeft = size * 39; break;
				case 'I': charLeft = size * 40; break;
				case 'J': charLeft = size * 41; break;
				case 'K': charLeft = size * 42; break;
				case 'L': charLeft = size * 43; break;
				case 'M': charLeft = size * 44; break;
				case 'N': charLeft = size * 45; break;
				case 'O': charLeft = size * 46; break;
				case 'P': charLeft = size * 47; break;
				case 'Q': charLeft = size * 48; break;
				case 'R': charLeft = size * 49; break;
				case 'S': charLeft = size * 50; break;
				case 'T': charLeft = size * 51; break;
				case 'U': charLeft = size * 52; break;
				case 'V': charLeft = size * 53; break;
				case 'W': charLeft = size * 54; break;
				case 'X': charLeft = size * 55; break;
				case 'Y': charLeft = size * 56; break;
				case 'Z': charLeft = size * 57; break;
				case '[': charLeft = size * 58; break;
				case '\\': charLeft = size * 59; break;
				case ']': charLeft = size * 60; break;
				case '^': charLeft = size * 61; break;
				case '_': charLeft = size * 62; break;
				case '`': charLeft = size * 63; break;
				case 'a': charLeft = size * 64; break;
				case 'b': charLeft = size * 65; break;
				case 'c': charLeft = size * 66; break;
				case 'd': charLeft = size * 67; break;
				case 'e': charLeft = size * 68; break;
				case 'f': charLeft = size * 69; break;
				case 'g': charLeft = size * 70; break;
				case 'h': charLeft = size * 71; break;
				case 'i': charLeft = size * 72; break;
				case 'j': charLeft = size * 73; break;
				case 'k': charLeft = size * 74; break;
				case 'l': charLeft = size * 75; break;
				case 'm': charLeft = size * 76; break;
				case 'n': charLeft = size * 77; break;
				case 'o': charLeft = size * 78; break;
				case 'p': charLeft = size * 79; break;
				case 'q': charLeft = size * 80; break;
				case 'r': charLeft = size * 81; break;
				case 's': charLeft = size * 82; break;
				case 't': charLeft = size * 83; break;
				case 'u': charLeft = size * 84; break;
				case 'v': charLeft = size * 85; break;
				case 'w': charLeft = size * 86; break;
				case 'x': charLeft = size * 87; break;
				case 'y': charLeft = size * 88; break;
				case 'z': charLeft = size * 89; break;
				case ' ': charLeft = size * 90; break;
			};
			// console.log(charLeft)
			context.drawImage(img.font, charLeft, charY, size - 1, sizeY, x, y, size - 1, sizeY);
		};
		input.split('').forEach(function(char, i){
			drawChar(char, x + i * 8);
		});
	},

	centerTextX(str){
		return gameWidth / 2 - str.length * 8 / 2;
	}

};