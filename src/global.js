let gameClock = 0, logged = false, fpsStart = 0, fpsFrame = 0, currentFps = 0, gameOver = false, starting = true, savedData = {},
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

drawString = (input, x, y, isAlt) => {
	input.split('').forEach(function(char, i){
		drawChar(char, x + (i * 8), y, isAlt);
	});
},

drawChar = (input, x, y, isAlt) => {
	let charLeft = 0, charTop = 0;
	const size = 8;
	switch(input){
		// case '0': charLeft = numStart; break;
		case '1': charLeft = size; break;
		case '2': charLeft = size * 2; break;
		case '3': charLeft = size * 3; break;
		case '4': charLeft = size * 4; break;
		case '5': charLeft = size * 5; break;
		case '6': charLeft = size * 6; break;
		case '7': charLeft = size * 7; break;
		case '8': charLeft = size * 8; break;
		case '9': charLeft = size * 9; break;
		case 'a': charLeft = size * 10; break;
		case 'b': charLeft = size * 11; break;
		case 'c': charLeft = size * 12; break;
		case 'd': charLeft = size * 13; break;
		case 'e': charLeft = size * 14; break;
		case 'f': charLeft = size * 15; break;
		case 'g': charLeft = size * 16; break;
		case 'h': charLeft = size * 17; break;
		case 'i': charLeft = size * 18; break;
		case 'j': charLeft = size * 19; break;
		case 'k': charLeft = size * 20; break;
		case 'l': charLeft = size * 21; break;
		case 'm': charLeft = size * 22; break;
		case 'n': charLeft = size * 23; break;
		case 'o': charLeft = size * 24; break;
		case 'p': charLeft = size * 25; break;
		case 'q': charLeft = size * 26; break;
		case 'r': charLeft = size * 27; break;
		case 's': charLeft = size * 28; break;
		case 't': charLeft = size * 29; break;
		case 'u': charLeft = size * 30; break;
		case 'v': charLeft = size * 31; break;
		case 'w': charLeft = size * 32; break;
		case 'x': charLeft = size * 33; break;
		case 'y': charLeft = size * 34; break;
		case 'z': charLeft = size * 35; break;
		case ':': charLeft = size * 36; break;
		case '.': charLeft = size * 37; break;
		case ' ': charLeft = size * 38; break;
	};
	if(isAlt) charTop = size * 2;
	context.drawImage(img.font, charLeft, charTop, size, size * 2, x, y, size, size * 2);
},

writeString = (input, x, y, color, large) => {
	context.save();
	context.font = large ? '16px bitmap' : '8px bitmap';
	context.fillStyle = colors.dark;
	if(large) y += 8;
	context.fillText(input, x, 8 + y);
	context.fillStyle = color ? color : colors.light;
	context.fillText(input, x, 7 + y);
	context.restore();
},

checkCollision = function(elA, elB, callback){
	if(elA.x <= elB.x + elB.width &&
		elA.x + elA.width >= elB.x &&
		elA.y <= elB.y + elB.height &&
		elA.y + elA.height >= elB.y){
		callback(elA, elB);
	}
};