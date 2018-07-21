const img = {},

addImage = (dataName, fileName) => {
	img[dataName] = new Image();
	img[dataName].src = 'img/' + fileName + '.png';
};

addImage('player', 'player');
addImage('playerBullet', 'player-bullet');
addImage('enemyGirlOne', 'enemy-girlone');
addImage('enemyGirlTwo', 'enemy-girltwo');
addImage('enemyPulse', 'enemy-pulse-blue');
addImage('lunasa', 'enemy-lunasa');
addImage('lyrica', 'enemy-lyrica');
addImage('merlin', 'enemy-merlin');
addImage('bulletBlue', 'bullet-blue');
addImage('bulletBlueBig', 'bullet-big-blue');
addImage('bulletRed', 'bullet-red');
addImage('bulletRedBig', 'bullet-big-red');
addImage('font', 'font');
addImage('yinYang', 'yinyang');
addImage('focus', 'focus');
addImage('power', 'power');
addImage('playerlife', 'playerlife');
addImage('startLogo', 'startlogo');
addImage('start', 'start');
addImage('explosion', 'explosions');
addImage('screen', 'screen');

const isMuted = true,

sounds = {
	bulletOne: new Howl({src: ['sound/bullet1.wav'], volume: .1}),
	bulletTwo: new Howl({src: ['sound/bullet2.wav'], volume: .1}),
	bulletThree: new Howl({src: ['sound/bullet3.wav'], volume: .1}),
	bulletPlayer: new Howl({src: ['sound/explosion.wav'], volume: 1}),
	explosion: new Howl({src: ['sound/explosion.wav'], volume: .5}),
	graze: new Howl({src: ['sound/graze.wav'], volume: 0.1})
	// bgmOne: new Howl({src: ['sound/bgm1.mp3'], volume: 0.75})
};

if(isMuted){
	for(soundName in sounds){
		sounds[soundName].volume(0);
	};
}

const clearBullets = () => {
	if(sounds.bulletOne.playing()) sounds.bulletOne.stop();
	if(sounds.bulletTwo.playing()) sounds.bulletTwo.stop();
	if(sounds.bulletThree.playing()) sounds.bulletThree.stop();
},

spawnSound = {

	bulletOne(){
		clearBullets()
		sounds.bulletOne.play();
	},

	bulletTwo(){
		clearBullets()
		sounds.bulletTwo.play();
	},

	bulletThree(){
		clearBullets()
		sounds.bulletThree.play();
	},

	explosion(){
		if(sounds.explosion.playing()) sounds.explosion.stop();
		sounds.explosion.play();
	},

	graze(){
		if(sounds.graze.playing()) sounds.graze.stop();
		sounds.graze.play();
	},

	bulletPlayer(){
		if(sounds.bulletPlayer.playing()) sounds.bulletPlayer.stop();
		sounds.bulletPlayer.play();
	},

	// bgmOne(){
	// 	sounds.bgmOne.play();
	// }

}
let gameClock = 0, logged = false, fpsStart = 0, fpsFrame = 0, currentFps = 0, gameOver = false, savedData = {},
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
				case '%': charLeft = size * 5; break;
				case '&': charLeft = size * 5; break;
				case '\'': charLeft = size * 7; break;
				case '(': charLeft = size * 7; break;
				case ')': charLeft = size * 8; break;
				case '*': charLeft = size * 10; break;
				case '+': charLeft = size * 11; break;
				case ',': charLeft = size * 12; break;
				case '-': charLeft = size * 13; break;
				case '.': charLeft = size * 13; break;
				case '/': charLeft = size * 15; break;
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
let isFullscreen = false;

const toggleFullscreen = () => {
	if(isFullscreen){
		mainWindow.setFullScreen(false);
		isFullscreen = false;
	} else {
		mainWindow.setFullScreen(true);
		isFullscreen = true;
	}
},

mapControls = () => {
	const keysDown = e => {
		if(starting){
			switch(e.which){ }
		} else if(gameOver){
			switch(e.which){ }
		} else {
			switch(e.which){
				case 38: player.data.moving.up = true; break;
				case 40: player.data.moving.down = true; break;
				case 37: player.data.moving.left = true; break;
				case 39: player.data.moving.right = true; break;
				case 90: player.data.shooting = true; break;
				// case 88: player.data.focus = true; break;
			}
		}
	}, keysUp = e => {
		if(starting){
			switch(e.which){
				case 90: starting = false; break;
				case 70: toggleFullscreen(); break;
				case 82: location.reload(); break;
			}
		} else if(gameOver){
			switch(e.which){
				case 70: toggleFullscreen(); break;
				case 82: location.reload(); break;
				case 90: location.reload(); break;
			}
		} else {
			switch(e.which){
				case 38: player.data.moving.up = false; break;
				case 40: player.data.moving.down = false; break;
				case 37: player.data.moving.left = false; break;
				case 39: player.data.moving.right = false; break;
				case 90: player.data.shooting = false; break;
				// case 88: player.data.focus = false; break;
				case 70: toggleFullscreen(); break;
				case 82: location.reload(); break;
			}
		}
	};
	document.addEventListener('keydown', keysDown);
	document.addEventListener('keyup', keysUp);
};
const totalTime = 75 * 60;
// const totalTime = 120;

let bossData = false, timeLeft = totalTime, timeString = String(totalTime), savedScore = false, gotHighScore = false;

const chrome = {

	processScore(input){
		let scoreString = String(input);
		for(j = scoreString.length; j < 6; j++){
			scoreString = '0' + scoreString;
		}
		return scoreString;
	},

	update(){
		time = () => {
			var millisecondsLeft = Math.floor(timeLeft % 60), secondsLeft = Math.floor(timeLeft / 60 % 60),
				minutesLeft = Math.floor(timeLeft / 60 / 60 % 60), processTime = input => {
				return input < 10 ? '0' + String(input) : String(input);
			}
			millisecondsLeft = processTime(millisecondsLeft);
			secondsLeft = processTime(secondsLeft);
			minutesLeft = processTime(minutesLeft).substring(1);
			timeString = minutesLeft + ':' + secondsLeft + ':' + millisecondsLeft;
			timeLeft--;
		}, showGameOver = () => {
			timeString = '';
			gameOver = true;
		}
		timeLeft ? time() : showGameOver();
		if(gameOver && !savedScore && currentScore > highScore) chrome.saveScore();
	},

	saveScore(){
		savedScore = true;
		if(currentScore > highScore){
			gotHighScore = true;
			highScore = currentScore;
			savedData.highScore = currentScore;
			storage.set('savedData', savedData);
		}
	},

	draw(){
		const score = () => {
			utilities.drawString('Score', 6, 4, true);
			utilities.drawString(chrome.processScore(currentScore), 6, 18);
			const highStr = 'High', scoreStr = chrome.processScore(highScore);
			utilities.drawString(highStr, utilities.centerTextX(highStr), 4, true);
			utilities.drawString(scoreStr, utilities.centerTextX(scoreStr), 18);
		},
		boss = () => {
			const lifeWidth = grid * 4;
			let lifeNum = bossData.life / 100;
			if(bossData.name == 'merlin') lifeNum = lifeNum / 3 * 2;
			const lifeTotal = Math.round(lifeWidth * lifeNum);
			const yOffset = grid + 3, lifeHeight = 7;
			const y = 22, height = 9;
			drawRect(gameWidth - 8 - lifeTotal, y, lifeTotal, height, colors.red)
			drawRect(gameWidth - 8 - lifeTotal, y + height, lifeTotal, 1, colors.dark)
		},
		time = () => {
			if(!timeString) timeString = '0:00:00';
			utilities.drawString(timeString, gameWidth - grid * 3.5 - 8, 4)
		},
		gameOverScreen = () => {
			drawImg(img.screen, 0, 0);
		},
		gameOverOverlay = () => {
			const gameOverY = gameHeight / 2 - grid * 2, gameOverStr = 'GAME OVER', restartStr = 'Press Shot to Restart';
			utilities.drawString(gameOverStr, utilities.centerTextX(gameOverStr), gameOverY, true);
			utilities.drawString(restartStr, utilities.centerTextX(restartStr), gameOverY + 14);
			if(gotHighScore){
				const highStr = 'You Got a New High Score', scoreStr = chrome.processScore(highScore)
				utilities.drawString(highStr, utilities.centerTextX(highStr), gameOverY + 14 * 2 + 8, true);
				utilities.drawString(scoreStr, utilities.centerTextX(scoreStr), gameOverY + 14 * 3 + 8);
			}
		},
		lives = () => {
			for(i = 0; i < player.data.lives - 1; i++) drawImg(img.playerlife, 8 + (grid + 2) * i, 4 + grid * 2);
		}
		if(gameOver) gameOverScreen();
		score();
		time();
		if(bossData) boss();
		if(player.data.lives) lives();
		if(gameOver) gameOverOverlay();

	}

};
const explosions = {

	dump: [],
	interval: 5,
	spawnTime: 12,
	spawnClock: 0,

	data(){
		return {
			size: 32,
			clock: 0,
			offset: 0
		}
	},

	spawn(bullet, enemy){
		if(explosions.spawnClock == 0){
			const explosionObj = explosions.data();
			explosionObj.x = (bullet.x + bullet.width / 2) - (explosionObj.size / 2);
			explosionObj.y = (bullet.y + bullet.height / 2) - (explosionObj.size / 2);
			if(enemy){
				explosionObj.x += enemy.width / 2;
				explosionObj.y += enemy.height / 2;
			}
			explosionObj.offset = -explosionObj.size;
			explosions.dump.push(explosionObj);
			explosions.spawnClock = 1;
			spawnSound.explosion();
		}
	},

	update(){
		if(explosions.spawnClock >= explosions.spawnTime) explosions.spawnClock = 0;
		else if(explosions.spawnClock != 0) explosions.spawnClock++;
		if(explosions.dump.length){
			const updateExplosion = (explosion, i) => {
				if(explosion.clock % explosions.interval == 0) explosion.offset += explosion.size;
				explosion.clock++;
				if(explosion.offset > explosion.size * 4) explosions.dump.splice(i, 1)
			};
			explosions.dump.forEach(updateExplosion)
		}
	},

	draw(){
		if(explosions.dump.length){
			const drawExplosion = explosion => {
				context.drawImage(img.explosion, explosion.offset, 0, explosion.size, explosion.size, explosion.x, explosion.y, explosion.size,
					explosion.size);
			};
			explosions.dump.forEach(drawExplosion)
		}
	}

};
let starting = true;

const start = {

	update(){

	},

	draw(){

		const logo = () => {
			const x = gameWidth / 2 - 192 / 2, y = grid * 2;
			drawImg(img.startLogo, x, y);
		}, prompt = () => {
			const str = 'press shot', y = grid * 7 + 4;
			utilities.drawString(str.toUpperCase(), utilities.centerTextX(str), y, true);
		}, score = () => {
			const str = 'Current High Score', y = gameHeight / 2 - 12 - 8, scoreStr = chrome.processScore(highScore), scoreY = y + 16;
			utilities.drawString(str.toUpperCase(), utilities.centerTextX(str), y);
			utilities.drawString(scoreStr, utilities.centerTextX(scoreStr), scoreY);
		}, instructions = () => {
			const strs = [
				'z (tap): shot',
				'z (hold): focus',
				'R: Restart',
				'F: Fullscreen'
			], y = gameHeight / 2 + grid * 2 - 4;
			strs.forEach((str, i) => {
				utilities.drawString(str.toUpperCase(), utilities.centerTextX(str), y + grid * i);
			});
		}, credit = () => {
			const str = '2018 PEACE RESEARCH', y = gameHeight - grid * 2 - 14;
			utilities.drawString(str, utilities.centerTextX(str), y, true);
		};

		drawImg(img.start, 0, 0);
		logo();
		prompt();
		instructions();
		credit();
		if(highScore > 0) score();
		
	}

};
const collisions = {

	dump: [],
	size: 16,
	playerPartitions: [],
	playerShotPartitions: [],
	dropPartitions: [],

	get(section, element, arr){
		if(section.x >= element.x - collisions.size &&
			section.x <= element.x + element.width &&
			section.y >= element.y - collisions.size &&
			section.y <= element.y + element.height){
			if(arr.indexOf(section.id) == -1) arr.push(section.id);
		}
	},

	boundingBox(){
		return  {
			x: player.data.position.x + player.data.size.x / 2 - 3 + 2,
			y: player.data.position.y + 12 + 2,
			width: 2,
			height: 2
		}
	},

	playerObj(){ return {x: player.data.position.x, y: player.data.position.y, width: player.data.size.x, height: player.data.size.y};
	},

	setup(){
		const partitionCount = {x: 15, y: 20};
		let partitionIndex = 0;
		for(var i = 0; i < partitionCount.y; i++){
			for(var j = 0; j < partitionCount.x; j++){
				collisions.dump.push({
					x: j * collisions.size,
					y: i * collisions.size,
					id: partitionIndex
				});
				partitionIndex++;
			}
		}
	},

	check(parts, element, callback){
		const partitionsArray = [];
		let found = false;
		parts.forEach(index => {
			partitionsArray.push(collisions.dump[index]);
		});
		partitionsArray.forEach(section => {
			if(element.x >= section.x && element.x <= section.x + collisions.size &&
				element.y >= section.y && element.y <= section.y + collisions.size) found = true;
		});
		if(found) callback();
	},

	update(){
		collisions.playerPartitions = [];
		collisions.playerShotPartitions = [];
		collisions.dropPartitions = [];

		collisions.dump.forEach(section => {
			collisions.get(section, collisions.playerObj(), collisions.playerPartitions); // getting player
			if(Object.keys(bulletsPlayer.dump).length){
				for(id in bulletsPlayer.dump){
					const bullet = bulletsPlayer.dump[id];
					const shotObj = {x: bullet.position.x, y: bullet.position.y, width: bullet.size.x, height: bullet.size.y};
					collisions.get(section, shotObj, collisions.playerShotPartitions);
				}
			}
			if(Object.keys(drop.dump).length){
				for(id in drop.dump){
					const dropItem = drop.dump[id];
					const dropObj = {x: dropItem.position.x, y: dropItem.position.y, width: dropItem.size.x, height: dropItem.size.y};
					collisions.get(section, dropObj, collisions.dropPartitions);
				}
			}
		});

		const checkBulletsWithPlayer = () => {
			let hitPlayer = false, hitGraze = false;
			for(id in bulletsEnemies.dump){
				bullet = bulletsEnemies.dump[id];
				const bulletObj = {
					x: bullet.position.x + 2,
					y: bullet.position.y + 2,
					width: bullet.size.x - 4,
					height: bullet.size.x - 4
				}, playerCollision = () => {
					checkCollision(collisions.boundingBox(), bulletObj, () => {
						hitPlayer = true;
						explosions.spawn(bulletObj, {x: player.data.position.x, y: player.data.position.y, height: player.data.size.y, width: player.data.size.x});
					});
				}
				if(!bullet.grazed){
					checkCollision(collisions.playerObj(), bulletObj, () => {
						bullet.grazed = true;
						hitGraze = true;
						playerCollision();
					});
				} else playerCollision();
			};
			if(hitGraze){
				currentScore += 150;
				spawnSound.graze();
			}
			if(hitPlayer){
				player.data.position = {x: gameWidth / 2 - 28 / 2, y: gameHeight - 42 - grid},
				player.data.powerLevel = 1;
				player.data.powerClock = 0;
				bulletsEnemies.dump = {};
				player.data.lives -= 1;
				if(!player.data.lives) gameOver = true;
			}
		},

		checkBulletsWithEnemies = () => {
			for(id in enemies.dump){
				enemy = enemies.dump[id];
				const enemyObj = {x: enemy.position.x, y: enemy.position.y, width: enemy.size.x, height: enemy.size.y};
				collisions.check(collisions.playerShotPartitions, enemyObj, () => {
					for(shotId in bulletsPlayer.dump){
						const shot = bulletsPlayer.dump[shotId];
						const shotObj = {x: shot.position.x, y: shot.position.y, width: shot.size.x, height: shot.size.y};
						checkCollision(shotObj, enemyObj, () => {
							enemy.health -= 1;
							if(bossData) bossData.life -=1;
							delete bulletsPlayer.dump[shotId];
							explosions.spawn(shotObj, enemyObj);
						});
					}
				});
			}
		},

		checkFocusWithEnemies = () => {
			for(id in enemies.dump){
				enemy = enemies.dump[id];
				if(enemy.position.x + enemy.size.x >= player.data.focusData.x &&
					enemy.position.x <= player.data.focusData.x + player.data.focusData.width &&
					enemy.position.y + enemy.size.y >= player.data.focusData.y &&
					player.data.shotClock % player.data.shotTime == 0){
					player.data.focusData.height -= enemy.position.y + enemy.size.y;
					enemy.health -= 1;
					if(bossData) bossData.life -=1;
					const enemyObj = {x: enemy.position.x, y: enemy.position.y, width: enemy.size.x, height: enemy.size.y};
					const focusObj = {x: player.data.focusData.x - 12, y: enemyObj.y, width: player.data.focusData.width, height: enemyObj.height};
					explosions.spawn(focusObj, enemyObj);
				}

			}
		},

		getDrops = () => {
			const playerObj = {x: player.data.position.x, y: player.data.position.y, width: player.data.size.x, height: player.data.size.y};
			collisions.check(collisions.dropPartitions, playerObj, () => {
				for(id in drop.dump){
					const dropItem = drop.dump[id];
					const dropObj = {x: dropItem.position.x, y: dropItem.position.y, width: dropItem.size.x, height: dropItem.size.y};
					checkCollision(dropObj, playerObj, () => {
						caughtDrop = true;
						delete drop.dump[id];
						player.data.powerLevel = 5;
						player.data.powerClock = player.data.powerLevel * player.data.powerInterval;
					});
				}
			});
		};

		if(!gameOver){
			if(Object.keys(bulletsEnemies.dump).length) checkBulletsWithPlayer();
			if(Object.keys(enemies.dump).length && Object.keys(bulletsPlayer.dump).length) checkBulletsWithEnemies();
			if(Object.keys(drop.dump).length) getDrops();
			if(player.data.focus && player.data.shooting) checkFocusWithEnemies();
		}
	},

	draw(){
		collisions.dump.forEach(section => {
			const drawBorders = () => {
				drawRect(section.x, section.y, 1, collisions.size, 'green');
				drawRect(section.x, section.y + collisions.size, collisions.size, 1, 'green');
			}, drawPlayer = () => {
				if(collisions.playerPartitions.indexOf(section.id) > -1) drawRect(section.x, section.y, collisions.size, collisions.size, 'red');
			}, drawPlayerShots = () => {
				if(collisions.playerShotPartitions.indexOf(section.id) > -1) drawRect(section.x, section.y, collisions.size, collisions.size, 'red');
			};
			context.save();
			context.globalAlpha = 0.5;
			drawBorders();
			context.globalAlpha = 0.25;
			drawPlayer();
			drawPlayerShots();
			context.restore();
		});
	}

};





const starTime = 5;

const background = {

	stars: {},

	spawnStar(){
		const isAlt = Math.floor(Math.random() * 3);
		const size = !isAlt ? 4 : 2;
		const starObj = {
			position: {x: Math.floor(Math.random() * (gameWidth * 2)), y: -size},
			speed: isAlt ? 4 : 10,
			size: size,
			id: randomId()
		};
		background.stars[starObj.id] = starObj
	},

	update(){
		const updateStar = star => {
			star.position.y += star.speed;
			star.position.x -= star.speed / 2
			if(star.position.y >= gameHeight) delete background.stars[star.id]
		};
		for(star in background.stars) updateStar(background.stars[star]);
		if(gameClock % starTime == 0) background.spawnStar();
	},

	draw(){
		const drawStar = star => {
			drawRect(star.position.x, star.position.y, star.size, star.size, colors.blue);
		};
		drawRect(0, 0, gameWidth, gameHeight, colors.dark)
		for(star in background.stars) drawStar(background.stars[star]);
	}

};
let currentWave = 'one', caughtDrop = false;

const enemies = {

	dump: {},

	data: {

		one(pos){
			const id = randomId();
			const enemyObj = {
				id: id,
				isLeft: pos > gameWidth / 2,
				size: {x: 18, y: 26},
				destination: {
					size: {x: player.data.size.x, y: player.data.size.y},
					position: {x: player.data.position.x, y: player.data.position.y}
				},
				image: img.enemyGirlOne,
				finished: false,
				angle: 0,
				clock: 0,
				health: 3,
				speedMod: 0.025,
				score: 1500
			};
			enemyObj.speed = {x: enemyObj.isLeft ? -1 : 1, y: 1.25};
			enemyObj.position = {x: pos, y: -enemyObj.size.y};
			if(!enemyObj.isLeft) enemyObj.speedMod = -enemyObj.speedMod;
			enemyObj.update = () => {
				const enemy = enemies.dump[id];
				enemy.position.x += enemy.speed.x;
				enemy.position.y += enemy.speed.y;
				enemy.speed.x += enemyObj.speedMod;
				if(enemy.clock == 30 && !enemy.finished){
					enemy.finished = true;
					modifiedAngle = 0;
					bulletsEnemies.spawn('enemyOne', enemy);
					bulletsEnemies.spawn('enemyOne', enemy);
					bulletsEnemies.spawn('enemyOne', enemy);
					bulletsEnemies.spawn('enemyOne', enemy);
					spawnSound.bulletOne()
				};
				enemy.clock++;
			}
			return enemyObj;
		},

		two(isRight){
			const id = randomId(), speed = 4;
			const enemyObj = {
				id: id,
				size: {x: 22, y: 28},
				image: img.enemyGirlTwo,
				speed: 3.25,
				speedMod: 0.04,
				clock: 0,
				health: 12,
				finished: false,
				sprayAngle: 0,
				score: 5500
			};
			enemyObj.position = {x: isRight ? gameWidth - grid * 3 - enemyObj.size.x : grid * 3, y: -enemyObj.size.y};
			if(!isRight) enemyObj.drop = true;
			enemyObj.update = () => {
				const enemy = enemies.dump[id];
				enemy.position.y += enemy.speed;
				enemy.speed -= enemy.speedMod;
				if(enemy.speed < 0 && !enemy.finished){
					enemy.finished = true;
					const sprayCount = 20, homingInterval = 150, spawnSpray = () => {
						for(i = 0; i < sprayCount; i++){
							bulletsEnemies.spawn('enemyTwoSpray', enemy);
							enemy.sprayAngle += Math.PI / sprayCount * 2;
						}
					};
					spawnSpray();
					setTimeout(spawnSpray, homingInterval * 2);
					bulletsEnemies.spawn('enemyTwoHoming', enemy);
					setTimeout(() => {bulletsEnemies.spawn('enemyTwoHoming', enemy)}, homingInterval);
					setTimeout(() => {bulletsEnemies.spawn('enemyTwoHoming', enemy)}, homingInterval * 2);
					setTimeout(() => {bulletsEnemies.spawn('enemyTwoHoming', enemy)}, homingInterval * 3);
					setTimeout(() => {bulletsEnemies.spawn('enemyTwoHoming', enemy)}, homingInterval * 4);
					spawnSound.bulletTwo()
				}
				enemy.clock++;
			};
			return enemyObj;
		},

		three(index){
			const id = randomId();
			const enemyObj = {
				id: id,
				size: {x: 18, y: 26},
				image: img.enemyGirlOne,
				clock: 0,
				speed: 3.25,
				speedMod: 0.07,
				health: 6,
				speedOffset: .3,
				shotInterval: 90,
				sprayAngle: Math.random() * Math.PI,
				score: 3000
			};
			enemyObj.position = {x: (grid * 3) * (index + 1) - grid * 2, y: -enemyObj.size.y};
			if(index == 0 || index == 4) enemyObj.speed += enemyObj.speedOffset;
			else if(index == 1 || index == 3) enemyObj.speed += enemyObj.speedOffset / 3;
			enemyObj.update = () => {
				const enemy = enemies.dump[id];
				if(enemy.speed > 0 && enemy.clock < 210){
					enemy.position.y += enemy.speed;
					enemy.speed -= enemy.speedMod;
				} else {
					const intervalOffset = 4;
					if(enemy.clock % enemy.shotInterval == 0 ||
						enemy.clock % enemy.shotInterval == intervalOffset ||
						enemy.clock % enemy.shotInterval == intervalOffset * 2 ||
						enemy.clock % enemy.shotInterval == intervalOffset * 3){
							const sprayCount = 8;
							for(i = 0; i < sprayCount; i++){
								bulletsEnemies.spawn('enemyThree', enemy);
								enemy.sprayAngle += Math.PI / sprayCount * 2;
							}
						spawnSound.bulletTwo()
					}
					if(enemy.clock > 210){
						enemy.position.y -= enemy.speed;
						enemy.speed += enemy.speedMod;
					}
					enemy.clock++
				}

			};
			return enemyObj;
		},

		four(isRight){
			const id = randomId();
			const enemyObj = {
				id: id,
				size: {x: 26, y: 26},
				image: img.enemyPulse,
				clock: 0,
				health: 14,
				speedOffset: 2,
				shotInterval: 12,
				score: 5000
			};
			enemyObj.position = {x: isRight ? gameWidth - enemyObj.size.x - grid : grid, y: -enemyObj.size.y};
			enemyObj.initPosition = enemyObj.position;
			if(isRight) enemyObj.drop = true;
			const angle = getAngle(enemyObj, player.data);
			enemyObj.speed = {x: -enemyObj.speedOffset * Math.cos(angle), y: -enemyObj.speedOffset * Math.sin(angle)};
			enemyObj.update = () => {
				const enemy = enemies.dump[id];
				enemy.position.x += enemy.speed.x;
				enemy.position.y += enemy.speed.y;
				if(enemy.clock % enemy.shotInterval == 0){
					bulletsEnemies.spawn('enemyFour', enemy);
					bulletsEnemies.spawn('enemyFour', enemy, {left: true});
					bulletsEnemies.spawn('enemyFour', enemy, {right: true});
					spawnSound.bulletThree()
				}
				enemy.clock++;
			};
			return enemyObj;
		},

		five(pos){
			const id = randomId();
			const enemyObj = {
				id: id,
				size: {x: 22, y: 28},
				image: img.enemyGirlTwo,
				speed: 5,
				speedMod: 0.125,
				shotInterval: 12,
				health: 8,
				sprayAngle: 0,
				angleOffset: -0.03,
				limit: 180,
				clock: 0,
				score: 5500
			};
			enemyObj.position = {x: pos, y: -enemyObj.size.y};
			if(pos > gameWidth / 2) enemyObj.angleOffset = -enemyObj.angleOffset;
			enemyObj.update = () => {
				const enemy = enemies.dump[id];
				if(enemy.speed > 0 && enemy.clock < enemy.limit){
					enemy.position.y += enemy.speed;
					enemy.speed -= enemy.speedMod;
				} else if(enemy.clock % enemy.shotInterval == 0 && enemy.clock < enemy.limit) {
					const sprayCount = 6;
					for(i = 0; i < sprayCount; i++){
						bulletsEnemies.spawn('enemyFive', enemy);
						enemy.sprayAngle += Math.PI / sprayCount * 2 + enemy.angleOffset;
					}
					spawnSound.bulletOne()
				} else if(enemy.clock >= enemy.limit){
					enemy.position.y -= enemy.speed;
					enemy.speed += enemy.speedMod;
				}
				enemy.clock++;
			};
			return enemyObj;
		},

		six(pos){
			const id = randomId();
			const enemyObj = {
				id: id,
				size: {x: 18, y: 26},
				image: img.enemyGirlOne,
				speed: 1.5,
				health: 5,
				position: {x: pos.x, y: pos.y},
				shotInterval: 45,
				sprayAngle: 0,
				clock: 0,
				score: 3500
			};
			if(pos.x == gameWidth && pos.y == grid * 4) enemyObj.drop = true;
			enemyObj.update = () => {
				const enemy = enemies.dump[id];
				enemy.position.x += pos.x > 0 ? -enemy.speed : enemy.speed;
				if(enemy.clock % enemy.shotInterval == 0){
					const sprayCount = 10;
					for(i = 0; i < sprayCount; i++){
						if(i < sprayCount / 2 + 1) bulletsEnemies.spawn('enemySix', enemy);
						enemy.sprayAngle += Math.PI / sprayCount * 2;
					}
					spawnSound.bulletTwo()
				}
				enemy.clock++;
			};
			return enemyObj;
		},

		lunasa(){
			const id = randomId();
			const enemyObj = {
				id: id,
				health: 100,
				size: {x: 26, y: 60},
				frames: true,
				moving: {left: false, right: true},
				direction: 0,
				image: img.lunasa,
				waveStarted: false,
				speed: 1.25,
				waveInterval: 60 * 4.4,
				startSpeed: 2.6,
				clock: 0,
				bobInterval: 90,
				spine: {
					size: {x: 2, y: 2},
					shotInterval: 10,
					secondShotInterval: 2,
					speedMod: 2.5
				},
				spray: {
					angle: 0,
					position: {x: grid * 2, y: grid * 3},
				},
				score: 20000
			};
			enemyObj.position = {x: grid * 2, y: -enemyObj.size.y};
			bossData = {
				name: 'lunasa',
				life: enemyObj.health
			};
			const spineAngle = function(enemy){
				enemy.spine.position = {
					x: enemy.position.x + enemy.size.x / 2 - enemy.spine.size.x / 2,
					y: enemy.position.y + enemy.size.y / 4 - enemy.spine.size.y / 2
				};
				enemy.spine.initPosition = {
					x: enemy.position.x + enemy.size.x / 2 - enemy.spine.size.x / 2,
					y: enemy.position.y + enemy.size.y / 4 - enemy.spine.size.y / 2
				};
				const angle = getAngle(player.data, enemy.spine);
				enemy.spine.speed = {x: enemy.spine.speedMod * Math.cos(angle), y: enemy.spine.speedMod * Math.sin(angle)};
			};
			spineAngle(enemyObj);
			enemyObj.update = () => {
				const enemy = enemies.dump[id], moveLeft = function(){
					if(enemy.moving.left) enemy.position.x -= enemy.speed;
					if(enemy.position.x <= grid * 2) enemy.moving.left = false;
				}, moveRight = () => {
					if(enemy.moving.right) enemy.position.x += enemy.speed;
					if(enemy.position.x >= gameWidth - enemy.size.x - grid * 2) enemy.moving.right = false;
				}, checkMove = () => {
					if(enemy.clock % enemy.waveInterval == 0){
						enemy.direction = !enemy.direction;
						enemy.direction ? enemy.moving.right = true : enemy.moving.left = true;
					}
					enemy.direction ? moveRight() : moveLeft();
				}, spawns = {
					spine(){
						enemy.spine.position.x += enemy.spine.speed.x;
						enemy.spine.position.y += enemy.spine.speed.y;
						if(enemy.clock % enemy.waveInterval == 0) spineAngle(enemy);
						if(enemy.spine.position.y <= gameHeight){
							if(enemy.clock % enemy.spine.shotInterval == 0){
								bulletsEnemies.spawn('lunasaSpine', enemy);
								bulletsEnemies.spawn('lunasaSpine', enemy, {left: true});
								bulletsEnemies.spawn('lunasaSpine', enemy, {right: true});
								spawnSound.bulletOne()
							}
							if(enemy.clock % enemy.spine.secondShotInterval == 0){
								bulletsEnemies.spawn('lunasaSecondSpine', enemy);
							}
						}
					},
					spray(){
						const sprayInterval = 20, homingInterval = 12;
						enemy.spray.position.x = enemy.direction ? grid * 2 : gameWidth - enemy.size.x - grid * 2;
						if(enemy.clock % enemy.waveInterval < enemy.waveInterval * .3 && enemy.clock % homingInterval == 0){
							bulletsEnemies.spawn('lunasaHoming', enemy);
							spawnSound.bulletThree()
						}
						if(enemy.clock % enemy.waveInterval < enemy.waveInterval * .6 && enemy.clock % sprayInterval == 0){
							const sprayCount = 30;
							for(i = 0; i < sprayCount; i++){
								bulletsEnemies.spawn('lunasaSpray', enemy);
								enemy.spray.angle += Math.PI / sprayCount * 2;
							}
							spawnSound.bulletTwo()
						}
					}
				}
				if(enemy.startSpeed > 0){
					enemy.position.y += enemy.startSpeed;
					enemy.startSpeed -= 0.03;
				} else {
					enemy.spray.position.y = enemy.position.y;
					checkMove();
					const waveLimit = 2;
					if(enemy.clock < enemy.waveInterval * waveLimit) spawns.spine();
					else if(enemy.clock >= enemy.waveInterval * waveLimit && enemy.clock < enemy.waveInterval * (waveLimit * 2)) spawns.spray();
					else if(enemy.clock >= enemy.waveInterval * (waveLimit * 2)){
						enemy.moving.right = false;
						enemy.moving.left = false;
						enemy.position.x -= enemy.speed;
						enemy.position.y -= enemy.speed;
						bossData = false;
					}
					if(enemy.clock % enemy.bobInterval == 0) enemy.position.y++;
					else if(enemy.clock % enemy.bobInterval == enemy.bobInterval / 2) enemy.position.y--;
					enemy.clock++;
				}
			};
			return enemyObj;
		},

		lyrica(){
			const id = randomId();
			const enemyObj = {
				id: id,
				health: 100,
				size: {x: 32, y: 60},
				frames: true,
				moving: {left: false, right: true},
				direction: 0,
				image: img.lyrica,
				waveStarted: false,
				speed: 1.25,
				startSpeed: 2.6,
				waveInterval: 60 * 4.25,
				clock: 0,
				spray: {
					angle: 0,
					interval: 15,
					index: 0,
					position: {x: grid * 2, y: grid * 3},
				},
				bobInterval: 90,
				score: 30000
			};
			enemyObj.position = {x: grid * 2, y: -enemyObj.size.y};
			bossData = {
				name: 'lyrica',
				life: enemyObj.health
			};
			enemyObj.update = () => {
				const enemy = enemies.dump[id], moveLeft = function(){
					if(enemy.moving.left) enemy.position.x -= enemy.speed;
					if(enemy.position.x <= grid * 2) enemy.moving.left = false;
				}, moveRight = () => {
					if(enemy.moving.right) enemy.position.x += enemy.speed;
					if(enemy.position.x >= gameWidth - enemy.size.x - grid * 2) enemy.moving.right = false;
				}, checkMove = () => {
					if(enemy.clock % enemy.waveInterval == 0){
						enemy.direction = !enemy.direction;
						enemy.direction ? enemy.moving.right = true : enemy.moving.left = true;
					}
					enemy.direction ? moveRight() : moveLeft();
				}, spawns = {
					spray(){
						const sprayInterval = 10;
						enemy.spray.position.x = enemy.direction ? grid * 2 : gameWidth - enemy.size.x - grid * 2;
						if(enemy.clock % enemy.waveInterval < enemy.waveInterval * .33 && enemy.clock % sprayInterval == 0){
							const sprayCount = 24;
							for(i = 0; i < sprayCount; i++){
								if(i < sprayCount / 2 + 1) bulletsEnemies.spawn('lyricaSprayRed', enemy);
								enemy.spray.angle += Math.PI / sprayCount * 2;
							}
							spawnSound.bulletTwo()
							enemy.spray.index = 0;
						} else if(enemy.clock % enemy.waveInterval >= enemy.waveInterval * .5 &&
							enemy.clock % enemy.waveInterval <= enemy.waveInterval * .75 &&
							enemy.clock % enemy.spray.interval == 0){
							const sprayCount = 32;
							for(i = 0; i < sprayCount; i++){
								// enemy.spray.index = i;
								bulletsEnemies.spawn('lyricaSprayBlue', enemy);
								enemy.spray.angle += Math.PI / sprayCount * 2;
							}
							spawnSound.bulletThree()
							enemy.spray.index++;
						}
					},
					sprayBig(){
						const sprayInterval = 40;
						enemy.spray.position = {x: player.data.position.x + player.data.size.x / 2, y: player.data.position.y + player.data.size.y / 2}
						if(enemy.clock % sprayInterval == 0){
							const sprayCount = 36;
							for(i = 0; i < sprayCount; i++){
								bulletsEnemies.spawn('lyricaSprayBigRed', enemy);
								enemy.spray.angle += Math.PI / sprayCount * 2;
							}
							spawnSound.bulletOne()
						} else if(enemy.clock % sprayInterval == sprayInterval / 2){
							const sprayCount = 36;
							for(i = 0; i < sprayCount; i++){
								bulletsEnemies.spawn('lyricaSprayBigBlue', enemy);
								enemy.spray.angle -= Math.PI / sprayCount * 2;
							}
							spawnSound.bulletTwo()
						}

					}
				};
				if(enemy.startSpeed > 0){
					enemy.position.y += enemy.startSpeed;
					enemy.startSpeed -= 0.03;
				} else {
					checkMove();
					const waveLimit = 2;
					if(enemy.clock < enemy.waveInterval * waveLimit) spawns.spray();
					if(enemy.clock >= enemy.waveInterval * waveLimit && enemy.clock < enemy.waveInterval * (waveLimit * 2) && !enemy.moving.left && !enemy.moving.right) spawns.sprayBig();
					else if(enemy.clock >= enemy.waveInterval * (waveLimit * 2)){
						enemy.moving.right = false;
						enemy.moving.left = false;
						enemy.position.x -= enemy.speed;
						enemy.position.y -= enemy.speed;
						bossData = false;
					}
					if(enemy.clock % enemy.bobInterval == 0) enemy.position.y++;
					else if(enemy.clock % enemy.bobInterval == enemy.bobInterval / 2) enemy.position.y--;
					enemy.clock++;
				}
			};
			return enemyObj;
		},

		merlin(){
			const id = randomId();
			const enemyObj = {
				id: id,
				health: 150,
				size: {x: 30, y: 62},
				frames: true,
				moving: {left: false, right: true},
				image: img.merlin,
				waveStarted: false,
				speed: 1.25,
				startSpeed: 2.6,
				waveInterval: 60 * 10,
				clock: 0,
				bobInterval: 90,
				spray: {
					angle: 0,
					interval: 15,
					limit: 8
				},
				tri: {
					angle: 0,
					interval: 15,
					limit: 8
				},
				homing: {},
				score: 60000
			};
			enemyObj.position = {x: gameWidth / 2 - enemyObj.size.x, y: -enemyObj.size.y};
			bossData = {
				name: 'merlin',
				life: enemyObj.health
			};
			enemyObj.update = () => {
				const enemy = enemies.dump[id], spawns = {
					sprayBlue(){
						const sprayInterval = 25;
						enemy.spray.position = {x: player.data.position.x + player.data.size.x / 2, y: player.data.position.y + player.data.size.y / 2}
						if(enemy.clock % sprayInterval == 0){
							const sprayCount = 40;
							for(i = 0; i < sprayCount; i++){
								if(i % enemy.spray.limit < enemy.spray.limit - enemy.spray.limit / 2) bulletsEnemies.spawn('merlinSpray', enemy);
								enemy.spray.angle += Math.PI / sprayCount * 2;
							}
							spawnSound.bulletThree()
							enemy.spray.angle += 0.2;
						}
					},
					homing(){
						const interval = 20;
						if(enemy.clock % interval == 0){
							enemy.homing.position = {x: Math.floor(Math.random() * gameWidth), y: -16};
							bulletsEnemies.spawn('merlinHoming', enemy);
							spawnSound.bulletThree()
						}
					},
					sprayTri(){
						const sprayInterval = 15, sprayLimit = 6
						if(enemy.clock % sprayInterval == 0){
							const sprayCount = 18;
							for(i = 0; i < sprayCount; i++){
								if(i % sprayLimit < sprayLimit - sprayLimit / 2) bulletsEnemies.spawn('merlinTri', enemy);
								enemy.tri.angle += Math.PI / sprayCount * 2;
							}
							enemy.tri.angle -= 0.1;
							spawnSound.bulletOne();
						}
					},
					sprayRed(){
						const sprayInterval = 30;
						if(enemy.clock % sprayInterval == 0){
							const sprayCount = 24;
							for(i = 0; i < sprayCount; i++){
								bulletsEnemies.spawn('merlinSprayRed', enemy);
								enemy.spray.angle += Math.PI / sprayCount * 2;
							}
							enemy.spray.angle -= 0.1;
							spawnSound.bulletTwo();
						}
					}
				}
				if(enemy.startSpeed > 0){
					enemy.position.y += enemy.startSpeed;
					enemy.startSpeed -= 0.0325;
				} else {
					if(enemy.clock % enemy.waveInterval < enemy.waveInterval / 2){
						spawns.sprayBlue();
						spawns.homing();
					} else {
						spawns.sprayTri();
						spawns.sprayRed();
					}
					if(enemy.clock % enemy.bobInterval == 0) enemy.position.y++;
					else if(enemy.clock % enemy.bobInterval == enemy.bobInterval / 2) enemy.position.y--;
					enemy.clock++;
					if(enemy.health <= 0){
						gameOver = true;
						currentWave = false;
					}
				}
			};
			return enemyObj;
		}

	},

	waves: {

		one(){
			const offset = 4.5;
			const lPos = grid * offset, rPos = gameWidth - grid * offset - 18, diff = 350;
			enemies.spawn(enemies.data.one(lPos));
			setTimeout(() => { enemies.spawn(enemies.data.one(lPos)); }, diff);
			setTimeout(() => { enemies.spawn(enemies.data.one(lPos)); }, diff * 2);
			setTimeout(() => { enemies.spawn(enemies.data.one(lPos)); }, diff * 3);
			setTimeout(() => { enemies.spawn(enemies.data.one(rPos)); }, diff * 4);
			setTimeout(() => { enemies.spawn(enemies.data.one(rPos)); }, diff * 5);
			setTimeout(() => { enemies.spawn(enemies.data.one(rPos)); }, diff * 6);
			setTimeout(() => {
				enemies.spawn(enemies.data.one(rPos));
				currentWave = 'two';
			}, diff * 7);
		},

		two(){
			const timeout = 350;
			enemies.spawn(enemies.data.two());
			setTimeout(() => {
				enemies.spawn(enemies.data.two(true));
				currentWave = 'lunasa';
			}, timeout);
		},

		three(){
			bossData = false;
			for(i = 0; i < 5; i++) enemies.spawn(enemies.data.three(i));
			currentWave = 'four';
		},

		four(){
			enemies.spawn(enemies.data.four());
			const timeout = 1000;
			setTimeout(() => {
				enemies.spawn(enemies.data.four(true));
				currentWave = 'lyrica';
			}, timeout);
		},

		five(){
			bossData = false;
			const timeout = 350;
			enemies.spawn(enemies.data.five(grid * 2));
			setTimeout(() => {
				enemies.spawn(enemies.data.five(gameWidth - grid * 2 - 22));
				currentWave = 'six';
			}, timeout);
		},

		six(){
			// currentWave = 'one';
			const timeout = 500;
			enemies.spawn(enemies.data.six({x: -18, y: grid * 3.5}));
			setTimeout(() => { enemies.spawn(enemies.data.six({x: -18, y: grid * 4})); }, timeout);
			setTimeout(() => { enemies.spawn(enemies.data.six({x: -18, y: grid * 4.5})); }, timeout * 2);

			setTimeout(() => { enemies.spawn(enemies.data.six({x: gameWidth, y: grid * 3.5})); }, timeout * 3);
			setTimeout(() => { enemies.spawn(enemies.data.six({x: gameWidth, y: grid * 4})); }, timeout * 4);
			setTimeout(() => {
				enemies.spawn(enemies.data.six({x: gameWidth, y: grid * 5}));
				currentWave = 'merlin';
			}, timeout * 5);
		},

		lunasa(){
			enemies.spawn(enemies.data.lunasa());
			currentWave = 'three';
		},

		lyrica(){
			enemies.spawn(enemies.data.lyrica());
			currentWave = 'five';
		},

		merlin(){
			enemies.spawn(enemies.data.merlin());
		}

	},

	spawn(enemy){
		enemies.dump[enemy.id] = enemy;
	},

	update(){
		if(Object.keys(enemies.dump).length){
			for(id in enemies.dump){
				const enemy = enemies.dump[id];
				enemy.update();
				if(enemy.position.y + enemy.size.y < -enemy.size.y || enemy.position.y > gameHeight ||
					enemy.position.x + enemy.size.x < -enemy.size.x || enemy.position.x > gameWidth) delete enemies.dump[id];
				if(enemy.health < 1){
					currentScore += enemy.score;
					if(enemy.drop && !caughtDrop) drop.spawn({ x: enemy.position.x + enemy.size.x / 2, y: enemy.position.y + enemy.size.y / 2});
					delete enemies.dump[id];
				}
			}
		} else if(currentWave) enemies.waves[currentWave]();
	},

	draw(){
		if(Object.keys(enemies.dump).length){
			for(id in enemies.dump){
				const enemy = enemies.dump[id];
				if(enemy.frames){
					let xOffset = 0;
					if(enemy.moving && (enemy.moving.left)) xOffset = enemy.size.x;
					else if(enemy.moving && (enemy.moving.right)) xOffset = enemy.size.x * 2;
					context.drawImage(enemy.image, xOffset, 0, enemy.size.x, enemy.size.y, enemy.position.x, enemy.position.y, enemy.size.x, enemy.size.y);
				} else drawImg(enemy.image, enemy.position.x, enemy.position.y, enemy.size.x, enemy.size.y);
			}
		}
	}

};
const drop = {

	dump: {},

	data(position){
		position.x -= 8;
		position.y -= 8;
		return {
			size: {x: 16, y: 16},
			position: position,
			speed: 0.75
		}
	},

	spawn(position){
		const dropItem = drop.data(position);
		if(!drop.dump[dropItem.id]) drop.dump[dropItem.id] = dropItem;
	},

	update(){
		if(Object.keys(drop.dump).length){
			for(id in drop.dump){
				const dropItem = drop.dump[id];
				dropItem.position.y += dropItem.speed;
			}
		}
	},

	draw(){

		if(Object.keys(drop.dump).length){
			for(id in drop.dump){
				const dropItem = drop.dump[id];
				drawImg(img.power, dropItem.position.x, dropItem.position.y);
			}
		}
	}

};
let modifiedAngle = 0

const bulletsEnemies = {

	dump: {},

	data: {

		enemyOne(enemy){
			let angle = getAngle(enemy.destination, enemy);
			const id = randomId(), speed = 2, angleModifier = 0.2;
			angle = angle + modifiedAngle - angleModifier * 2;
			modifiedAngle += angleModifier;
			return {
				id: id,
				image: img.bulletRed,
				size: {x: 10, y: 10},
				position: {x: enemy.position.x + enemy.size.x / 2 - 10, y: enemy.position.y + enemy.size.y / 2 + 10},
				speed: {x: speed * Math.cos(angle), y: speed * Math.sin(angle)},
				update(){
					const bullet = bulletsEnemies.dump[id];
					bullet.position.x += bullet.speed.x;
					bullet.position.y += bullet.speed.y;
				}
			}
		},

		enemyTwoSpray(enemy){
			const id = randomId(), angleDiff = .02, bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletRed,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: Math.round(enemy.position.x + enemy.size.x / 2 - bulletSize / 2),
					y: Math.round(enemy.position.y + enemy.size.y / 2 + bulletSize / 2)
				},
				angle: enemy.sprayAngle,
				speed: 1.5,
				clock: 0
			}
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				bullet.clock++;
			}
			return bulletObj;
		},

		enemyTwoHoming(enemy){
			const id = randomId(), bulletSize = 16;
			const bulletObj = {
				id: id,
				image: img.bulletBlueBig,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: Math.round(enemy.position.x + enemy.size.x / 2 - bulletSize / 2),
					y: Math.round(enemy.position.y + enemy.size.y / 2 + bulletSize / 2)
				},
				speedMod: 2,
				clock: 0
			};
			const homingAngle = getAngle(bulletObj, player.data);
			bulletObj.speed = { x: bulletObj.speedMod * Math.cos(homingAngle), y: bulletObj.speedMod * Math.sin(homingAngle)};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x -= bullet.speed.x;
				bullet.position.y -= bullet.speed.y;
				bullet.clock++;
			}
			return bulletObj;
		},

		enemyThree(enemy){
			const id = randomId(), angleDiff = .02, bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: Math.round(enemy.position.x + enemy.size.x / 2 - bulletSize / 2),
					y: Math.round(enemy.position.y + enemy.size.y / 2 + bulletSize / 2)
				},
				angle: enemy.sprayAngle,
				speed: 1.75,
				clock: 0
			}
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				bullet.clock++;
			}
			return bulletObj;
		},

		enemyFour(enemy, opts){
			const id = randomId(), bulletSize = 16;
			const bulletObj = {
				id: id,
				image: img.bulletRedBig,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: Math.round(enemy.position.x + enemy.size.x / 2 - bulletSize / 2),
					y: Math.round(enemy.position.y + enemy.size.y / 2 + bulletSize / 2)
				},
				speedMod: 1.25,
				clock: 0
			}
			let angle = getAngle(bulletObj, {size: {x: 2, y: 2}, position: enemy.initPosition});
			const sideMod = 1;
			if(opts && (opts.left)){
				angle += enemy.direction ? -sideMod : sideMod;
			} else if(opts && (opts.right)){
				angle += enemy.direction ? sideMod : -sideMod;
			}
			bulletObj.speed = {
				x: bulletObj.speedMod * Math.cos(angle),
				y: bulletObj.speedMod * -Math.sin(angle)
			}
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x -= bullet.speed.x;
				bullet.position.y += bullet.speed.y;
				bullet.clock++;
			}
			return bulletObj;
		},

		enemyFive(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: enemy.position.x > gameWidth / 2 ? img.bulletRed : img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: Math.round(enemy.position.x + enemy.size.x / 2 - bulletSize / 2),
					y: Math.round(enemy.position.y + enemy.size.y / 2 + bulletSize / 2)
				},
				angle: enemy.sprayAngle,
				speed: 1.75
			}
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
			}
			return bulletObj;
		},

		enemySix(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: Math.round(enemy.position.x + enemy.size.x / 2 - bulletSize / 2),
					y: Math.round(enemy.position.y + enemy.size.y / 2 + bulletSize / 2)
				},
				angle: enemy.sprayAngle,
				speed: 1.25
			}
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
			}
			return bulletObj;
		},

		lunasaSpine(enemy, opts){
			const id = randomId();
			const bulletObj = {
				id: id,
				image: img.bulletBlue,
				size: {x: 10, y: 10},
				speedMod: 2.5
			};
			bulletObj.position = {
				x: Math.round(enemy.spine.position.x + enemy.spine.size.x / 2 - bulletObj.size.x / 2),
				y: Math.round(enemy.spine.position.y + enemy.spine.size.y / 2 + bulletObj.size.y / 2)
			};
			let angle = getAngle(bulletObj, {size: enemy.spine.size, position: enemy.spine.initPosition});
			const sideMod = 0.5;
			if(opts && (opts.left)){
				angle += enemy.direction ? -sideMod : sideMod;
			} else if(opts && (opts.right)){
				angle += enemy.direction ? sideMod : -sideMod;
			}
			bulletObj.speed = {
				x: bulletObj.speedMod * Math.cos(angle),
				y: bulletObj.speedMod * -Math.sin(angle)
			}
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x -= bullet.speed.x;
				bullet.position.y += bullet.speed.y;
				bullet.clock++;
			}
			return bulletObj;
		},

		lunasaSecondSpine(enemy){
			const id = randomId();
			const bulletObj = {
				id: id,
				image: img.bulletRedBig,
				size: {x: 16, y: 16},
				speed: {x: 1, y: 1},
				speedMod: 0,
				speedStep: 0.02,
				hasVisibility: true,
				visible: false,
				visibleTime: 60 * 1.5,
				moveTime: 60 * 2.5,
				clock: 0
			};
			bulletObj.position = {
				x: Math.round(enemy.spine.position.x + enemy.spine.size.x / 2 - bulletObj.size.x / 2),
				y: Math.round(enemy.spine.position.y + enemy.spine.size.y / 2 + bulletObj.size.y / 2)
			};

			const getSpeed = () => {
				let num = (Math.random() * 4) - 2;
				const doGetSpeed = () => {
					if(num > -1 && num < 1){
						num = (Math.random() * 4) - 2;
						return doGetSpeed();
					} else {
						return num;
					}
				}
				num = doGetSpeed();
				return num;
			}

			const randomDestination = {
				size: {x: 2, y: 2},
				position: {x: Math.round(Math.random() * gameWidth), y: Math.round(Math.random() * gameHeight)}
			};
			const angle = getAngle(bulletObj, randomDestination)
			bulletObj.speed.x = Math.cos(angle);
			bulletObj.speed.y = Math.sin(angle);

			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				if(bullet.clock >= bullet.visibleTime){
					if(!bullet.visible) bullet.visible = true;
					bullet.position.y += bullet.speedMod * bullet.speed.y;
					bullet.position.x -= bullet.speedMod * bullet.speed.x;
					bullet.position.x = bullet.position.x;
					bullet.position.y = bullet.position.y;
					if(bullet.clock >= bullet.moveTime) bullet.speedMod += bullet.speedStep;
				}
				bullet.clock++;
			}
			return bulletObj;
		},

		lunasaSpray(enemy){
			const id = randomId(), angleDiff = .02, bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: Math.round(enemy.spray.position.x + enemy.size.x / 2 - bulletSize / 2),
					y: Math.round(enemy.spray.position.y + enemy.size.y / 2 + bulletSize / 2)
				},
				angle: enemy.spray.angle,
				speed: 4,
				speedDiff: .1,
				clock: 0,
				speedLimit: -2.6,
				angleDiff: enemy.direction ? angleDiff : -angleDiff
			}
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				bullet.angle += bullet.angleDiff;
				if(bullet.speed > bullet.speedLimit) bullet.speed -= bullet.speedDiff;
				bullet.clock++;
			}
			return bulletObj;
		},

		lunasaHoming(enemy){
			const id = randomId(), angleDiff = .02, bulletSize = 16;
			const bulletObj = {
				id: id,
				image: img.bulletRedBig,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: Math.round(enemy.spray.position.x + enemy.size.x / 2 - bulletSize / 2),
					y: Math.round(enemy.spray.position.y + enemy.size.y / 2 + bulletSize / 2)
				},
				speedMod: 2,
				clock: 0
			};
			if(enemy.clock % enemy.waveInterval == 0){
				enemy.homingAngle = getAngle(bulletObj, player.data);
			}
			bulletObj.speed = { x: bulletObj.speedMod * Math.cos(enemy.homingAngle), y: bulletObj.speedMod * Math.sin(enemy.homingAngle)};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x -= bullet.speed.x;
				bullet.position.y -= bullet.speed.y;
				bullet.clock++;
			}
			return bulletObj;
		},

		lyricaSprayRed(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletRed,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: Math.round(enemy.spray.position.x + enemy.size.x / 2 - bulletSize / 2),
					y: Math.round(enemy.spray.position.y + enemy.size.y / 2 + bulletSize / 2)
				},
				angle: enemy.spray.angle,
				speedInit: 2.5,
				speedSecond: 1.25,
				speedDiff: .04,
				speedSecondDiff: .05,
				finished: false,
				clock: 0
			}
			bulletObj.speed = {x: bulletObj.speedInit, y: bulletObj.speedInit};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed.x * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed.y * Math.sin(bullet.angle);
				if(bullet.speed.x > -1 && !bullet.finished){
					bullet.speed.x -= bullet.speedDiff;
					bullet.speed.y -= bullet.speedDiff;
				} else if(bullet.speed.x <= -.75 && !bullet.finished){
					bullet.finished = true;
					bullet.angle = getAngle(bullet, {
						size: {x: 2, y: 2},
						position: {x: Math.floor(Math.random() * gameWidth), y: Math.floor(Math.random() * gameHeight)}
					});
					bullet.speed.x = bullet.speedSecond;
					bullet.speed.y = bullet.speedSecond;
				}
				bullet.clock++;
			}
			return bulletObj;
		},

		lyricaSprayBlue(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: Math.round(enemy.position.x + enemy.size.x / 2 - bulletSize / 2),
					y: Math.round(enemy.position.y + enemy.size.y / 2 + bulletSize / 2)
				},
				angle: enemy.spray.angle,
				speed: 2.5,
				finished: false,
				speedMod: 0.02
			};
			if(enemy.spray.index % 2 == 0) enemy.spray.angle += Math.PI / 16
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				if(bullet.speed > 1) bullet.speed -= bullet.speedMod;
			}
			return bulletObj;
		},

		lyricaSprayBigRed(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletRed,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: Math.round(enemy.position.x + enemy.size.x / 2 - bulletSize / 2),
					y: Math.round(enemy.position.y + enemy.size.y / 2 + bulletSize / 2)
				},
				angle: enemy.spray.angle,
				speed: 0.5,
				finished: false,
				speedMod: 0.007,
				angleDiff: 0.004
			};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				bullet.angle += bullet.angleDiff;
				bullet.speed += bullet.speedMod;
			}
			return bulletObj;
		},

		lyricaSprayBigBlue(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: Math.round(enemy.position.x + enemy.size.x / 2 - bulletSize / 2),
					y: Math.round(enemy.position.y + enemy.size.y / 2 + bulletSize / 2)
				},
				angle: enemy.spray.angle,
				speed: 0.5,
				speedMod: 0.007,
				angleDiff: 0.004
			};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				bullet.angle -= bullet.angleDiff;
				bullet.speed += bullet.speedMod;
			}
			return bulletObj;
		},

		merlinSpray(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: Math.round(enemy.position.x + enemy.size.x / 2 - bulletSize / 2),
					y: Math.round(enemy.position.y + enemy.size.y / 2 + bulletSize / 2)
				},
				angle: enemy.spray.angle,
				speed: 1,
				angleDiff: 0.004,
				speedDiff: 0.0008
			};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				bullet.angle -= bullet.angleDiff;
				bullet.speed += bullet.speedDiff;
			}
			return bulletObj;
		},

		merlinHoming(enemy){
			const id = randomId(), bulletSize = 16;
			const bulletObj = {
				id: id,
				image: img.bulletRedBig,
				size: {x: bulletSize, y: bulletSize},
				position: enemy.homing.position,
				speed: 1,
				angleDiff: 0.004,
				speedDiff: 0.0008
			};
			bulletObj.angle = getAngle(bulletObj, player.data);
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x -= bullet.speed * Math.cos(bullet.angle);
				bullet.position.y -= bullet.speed * Math.sin(bullet.angle);
			}
			return bulletObj;
		},

		merlinTri(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletRed,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: Math.round(enemy.position.x + enemy.size.x / 2 - bulletSize / 2),
					y: Math.round(enemy.position.y + enemy.size.y / 2 + bulletSize / 2)
				},
				angle: enemy.tri.angle,
				speed: .9,
				finished: false,
				angleDiff: 0.004,
				speedDiff: 0.0008
			};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				if(bullet.speed > .99){
					if(!bullet.finished){
						bullet.finished = true;
						bullet.angle = getAngle(bullet, {
							position: {x: Math.floor(Math.random() * gameWidth), y: Math.floor(Math.random() * gameHeight)},
							size: {x: 2, y: 2}
						});
					}
				} else {
					bullet.angle -= bullet.angleDiff;
					bullet.speed += bullet.speedDiff;
				}
			}
			return bulletObj;
		},

		merlinSprayRed(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: Math.round(enemy.position.x + enemy.size.x / 2 - bulletSize / 2),
					y: Math.round(enemy.position.y + enemy.size.y / 2 + bulletSize / 2)
				},
				angle: enemy.spray.angle,
				speed: 1
			};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
			}
			return bulletObj;
		}

	},

	spawn(type, enemy, opts){
		opts = opts ? opts : false;
		const bullet = bulletsEnemies.data[type](enemy, opts);
		if(!bulletsEnemies.dump[bullet.id]) bulletsEnemies.dump[bullet.id] = bullet;
	},

	update(){
		if(Object.keys(bulletsEnemies.dump).length){
			for(id in bulletsEnemies.dump){
				const bullet = bulletsEnemies.dump[id];
				bullet.update();
				if(bullet.position.y + bullet.size.y < -gameHeight / 6 || bullet.position.y > gameHeight + gameHeight / 6 ||
					bullet.position.x + bullet.size.x < -gameWidth / 6 || bullet.position.x > gameWidth + gameWidth / 6) delete bulletsEnemies.dump[id];
			}
		}
	},

	draw(){
		if(Object.keys(bulletsEnemies.dump).length){
			for(id in bulletsEnemies.dump){
				const bullet = bulletsEnemies.dump[id];
				if(!bullet.hasVisibility || (bullet.hasVisibility && (bullet.visible)))
					drawImg(bullet.image, bullet.position.x, bullet.position.y, bullet.size.x, bullet.size.y);
			}
		}
	}

};
const bulletsPlayer = {

	data(type){
		const bulletObject = {
			size: {x: 8, y: 12},
			speed: {x: 0, y: 18},
			id: randomId()
		};
		bulletObject.position = {x: player.data.position.x + player.data.size.x / 2 - bulletObject.size.x / 2, y: player.data.position.y}
		if(type){
			bulletObject.type = type;
			const yOffset = 1, xOffset = 4;
			switch(type){
				case 'leftA':
					bulletObject.position.x -= bulletObject.size.x - xOffset;
					bulletObject.position.y += yOffset;
					break;
				case 'rightA':
					bulletObject.position.x += bulletObject.size.x - xOffset;
					bulletObject.position.y += yOffset;
					break;
				case 'leftB':
					bulletObject.position.x -= bulletObject.size.x * 2 - xOffset * 2;
					bulletObject.position.y += yOffset * 2;
					break;
				case 'rightB':
					bulletObject.position.x += bulletObject.size.x * 2 - xOffset * 2;
					bulletObject.position.y += yOffset * 2;
					break;
				case 'leftC':
					bulletObject.position.x -= bulletObject.size.x * 3 - xOffset * 3;
					bulletObject.position.y += yOffset * 4;
					break;
				case 'rightC':
					bulletObject.position.x += bulletObject.size.x * 3 - xOffset * 3;
					bulletObject.position.y += yOffset * 4;
					break;
				case 'leftD':
					bulletObject.position.x -= bulletObject.size.x * 4 - xOffset * 4;
					bulletObject.position.y += yOffset * 6;
					break;
				case 'rightD':
					bulletObject.position.x += bulletObject.size.x * 4 - xOffset * 4;
					bulletObject.position.y += yOffset * 6;
					break;
				case 'leftE':
					bulletObject.position.x -= bulletObject.size.x * 5 - xOffset * 5;
					bulletObject.position.y += yOffset * 8;
					break;
				case 'rightE':
					bulletObject.position.x += bulletObject.size.x * 5 - xOffset * 5;
					bulletObject.position.y += yOffset * 8;
					break;
			}
		}
		return bulletObject;
	},

	dump: {},

	spawn(){
		const bulletsArray = [
			bulletsPlayer.data(),
			bulletsPlayer.data('leftA'),
			bulletsPlayer.data('rightA')
		];
		// if(player.data.powerLevel >= 2){
		// 	bulletsArray.push(bulletsPlayer.data('leftB'));
		// 	bulletsArray.push(bulletsPlayer.data('rightB'));
		// 	if(player.data.powerLevel >= 3){
		// 		bulletsArray.push(bulletsPlayer.data('leftC'));
		// 		bulletsArray.push(bulletsPlayer.data('rightC'));
		// 		if(player.data.powerLevel >= 4){
		// 			bulletsArray.push(bulletsPlayer.data('leftD'));
		// 			bulletsArray.push(bulletsPlayer.data('rightD'));
		// 			if(player.data.powerLevel >= 5){
		// 				bulletsArray.push(bulletsPlayer.data('leftE'));
		// 				bulletsArray.push(bulletsPlayer.data('rightE'));
		// 			} 
		// 		} 
		// 	} 
		// }
		bulletsArray.forEach(bullet => {
			bulletsPlayer.dump[bullet.id] = bullet;
		});
		spawnSound.bulletPlayer();
	},

	update(){

		const doBullet = bullet => {
			let ySpeed = bullet.speed.y;
			if(player.data.moving.up) ySpeed += player.data.focus ? player.data.speedSlow : player.data.speed;
			else if(player.data.moving.down) ySpeed -= player.data.focus ? player.data.speedSlow : player.data.speed;
			ySpeed++;
			const doTypes = () => {
				const speed = 2, aDiff = .99, bDiff = .97, cDiff = .94, dDiff = .9, eDiff = .84;
				switch(bullet.type){
					case 'leftA':
						bullet.position.x -= speed;
						bullet.position.y -= ySpeed * aDiff;
						break;
					case 'rightA':
						bullet.position.x += speed;
						bullet.position.y -= ySpeed * aDiff;
						break;
					case 'leftB':
						bullet.position.x -= speed * 2;
						bullet.position.y -= ySpeed * bDiff;
						break;
					case 'rightB':
						bullet.position.x += speed * 2;
						bullet.position.y -= ySpeed * bDiff;
						break;
					case 'leftC':
						bullet.position.x -= speed * 3;
						bullet.position.y -= ySpeed * cDiff;
						break;
					case 'rightC':
						bullet.position.x += speed * 3;
						bullet.position.y -= ySpeed * cDiff;
						break;
					case 'leftD':
						bullet.position.x -= speed * 4;
						bullet.position.y -= ySpeed * dDiff;
						break;
					case 'rightD':
						bullet.position.x += speed * 4;
						bullet.position.y -= ySpeed * dDiff;
						break;
					case 'leftE':
						bullet.position.x -= speed * 5;
						bullet.position.y -= ySpeed * eDiff;
						break;
					case 'rightE':
						bullet.position.x += speed * 5;
						bullet.position.y -= ySpeed * eDiff;
						break;
				}
			}
			if(bullet.type) doTypes();
			else bullet.position.y -= ySpeed;
			if(bullet.position.y < 0 - bullet.size.y) delete bulletsPlayer.dump[id];
		},

		doFocus = () => {
			if(!player.data.focus){
				player.data.focusData = {height: 0};
				player.data.focus = true;
			}
			player.data.focusData.x = player.data.position.x;
			player.data.focusData.width = 6;
			if(player.data.focusData.height < player.data.focusMax) player.data.focusData.height += player.data.focusGrow;
			player.data.focusData.y = player.data.position.y - player.data.focusData.height - 4;
			player.data.focusData.x += player.data.size.x / 2 - player.data.focusData.width / 2;
			if(player.data.moving.left) player.data.focusData.x -= player.data.moveOffset;
			else if(player.data.moving.right) player.data.focusData.x += player.data.moveOffset;
		};

		if(player.data.shooting && !gameOver){
			if(player.data.shotClock < player.data.shotLimit && player.data.shotClock % player.data.shotTime == 0) bulletsPlayer.spawn();
			else if(player.data.shotClock >= player.data.shotLimit) doFocus();
			player.data.shotClock++;
		} else if(player.data.shotClock){
			player.data.shotClock = 0;
			player.data.focus = false;
		}

		if(Object.keys(bulletsPlayer.dump).length) for(id in bulletsPlayer.dump) doBullet(bulletsPlayer.dump[id]);
	},

	draw(){

		const doBullet = bullet => {
			drawImg(img.playerBullet, bullet.position.x, bullet.position.y, bullet.size.x, bullet.size.y);
		},

		doFocus = () => {
			drawRect(player.data.focusData.x, player.data.focusData.y,
				player.data.focusData.width, player.data.focusData.height, colors.red);
			drawRect(player.data.focusData.x + 1, player.data.focusData.y,
				player.data.focusData.width - 2, player.data.focusData.height, colors.peach);
			drawRect(player.data.focusData.x + 1, player.data.focusData.y + player.data.focusData.height,
				player.data.focusData.width - 2, 1, colors.red);
		};

		if(Object.keys(bulletsPlayer.dump).length) for(id in bulletsPlayer.dump) doBullet(bulletsPlayer.dump[id]);
		if(player.data.focus) doFocus();

	}

};
const boxSize = 4, boxOffset = 12;

const player = {

	data: {
		size: {x: 28, y: 42},
		position: {x: gameWidth / 2 - 28 / 2, y: gameHeight - 42 - grid},
		moving: {up: false, down: false, left: false, right: false},
		shooting: false,
		shotClock: 0,
		shotTime: 4,
		shotLimit: 8,
		slowHeight: 0,
		focus: false,
		focusData: {},
		focusMax: 0,
		focusGrow: 18,
		speed: 3,
		speedSlow: 1,
		powerClock: 0,
		powerInterval: 140,
		powerLevel: 1,
		gameOverTime: false,
		gameOverLimit: 60 * 10,
		moveOffset: 1,
		lives: 3
	},

	update(){
		var speed = player.data.focus ? player.data.speedSlow : player.data.speed;
		if(player.data.moving.left) player.data.position.x -= speed;
		else if(player.data.moving.right) player.data.position.x += speed;
		if(player.data.moving.up) player.data.position.y -= speed;
		else if(player.data.moving.down) player.data.position.y += speed;

		if(player.data.position.x < 0) player.data.position.x = 0;
		else if(player.data.position.x + player.data.size.x > gameWidth) player.data.position.x = gameWidth - player.data.size.x;
		if(player.data.position.y < 0) player.data.position.y = 0;
		else if(player.data.position.y + player.data.size.y > gameHeight) player.data.position.y = gameHeight - player.data.size.y;

		if(player.data.powerClock){
			if(player.data.powerClock % player.data.powerInterval == 0 && player.data.powerClock != player.data.powerInterval * 5) player.data.powerLevel--;
			player.data.powerClock--;
		}

		player.data.focusMax = gameHeight - (gameHeight - player.data.position.y) - 4;

		if(gameOver) {
			player.data.position = {x: gameWidth / 2 - 28 / 2, y: gameHeight - 42 - grid};
			if(!player.data.gameOverTime) player.data.gameOverTime = gameClock;
			if(gameClock == player.data.gameOverTime + player.data.gameOverLimit) location.reload();
		}
	},

	draw(){
		if(gameOver){

		} else {
			const focus = () => {
				let focusX = player.data.position.x + player.data.size.x / 2 - 3;
				if(player.data.moving.left) focusX -= player.data.moveOffset;
				else if(player.data.moving.right) focusX += player.data.moveOffset;
				drawImg(img.focus, focusX, player.data.position.y + 12);
			}, yinYangs = ()=> {
				const yinYangSize = 16, yinYangTime = 60, xOffset = 3;
				let yOffset = player.data.position.y + player.data.size.y / 2 - yinYangSize / 2;
				if(gameClock % yinYangTime > yinYangTime / 2) yOffset--;
				let extraOffset = player.data.moving.left ? 1 : 0;
				if(player.data.moving.right) extraOffset = -1;
				drawImg(img.yinYang, player.data.position.x - yinYangSize - xOffset + extraOffset, yOffset)
				drawImg(img.yinYang, player.data.position.x + player.data.size.x + xOffset + extraOffset, yOffset)
			};
			let xOffset = 0;
			if(player.data.moving.left) xOffset = player.data.size.x;
			else if(player.data.moving.right) xOffset = player.data.size.x * 2
			context.drawImage(img.player, xOffset, 0, 28, 42, player.data.position.x, player.data.position.y, player.data.size.x, player.data.size.y);
			yinYangs();
			// if(player.data.focus)
			focus();
		}
	}

};
const updateLoop = () => {
	background.update();
	player.update();
	bulletsEnemies.update();
	enemies.update();
	bulletsPlayer.update();
	drop.update();
	explosions.update();
	chrome.update();
	collisions.update();
},

drawLoop = () => {
	background.draw();
	player.draw();
	bulletsEnemies.draw();
	enemies.draw();
	bulletsPlayer.draw();
	drop.draw();
	explosions.draw();
	chrome.draw();
	// collisions.draw();
},

gameLoop = () => {
	clearGame();
	if(starting){
		start.update();
		start.draw();
	} else {
		updateLoop();
		drawLoop();
		gameClock++;
	}
	window.requestAnimationFrame(gameLoop);
},

initGame = () => {
	context.imageSmoothingEnabled = false;
	storage.get('savedData', (err, data) => {
		savedData = data;
		if(savedData.highScore) highScore = savedData.highScore;
		$(window).resize(resizeGame);
		mapControls();
		collisions.setup();
		canvasEl.show();
		gameLoop();
	});
}