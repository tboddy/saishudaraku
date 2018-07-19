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
			minutesLeft = processTime(minutesLeft);
			timeString = String(minutesLeft) + ':' + String(secondsLeft) + ':' + millisecondsLeft;
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
			const highX = gameWidth / 2 - grid;
			writeString('SCORE', 8, 8, colors.yellow);
			writeString('HIGH', highX, 8, colors.yellow);
			writeString(chrome.processScore(currentScore), 8, grid + 2);
			writeString(chrome.processScore(highScore), highX - 8, grid + 2);
		},
		boss = () => {
			const lifeWidth = grid * 4;
			let lifeNum = bossData.life / 100;
			if(bossData.name == 'merlin') lifeNum = lifeNum / 3 * 2;
			const lifeTotal = Math.round(lifeWidth * lifeNum);
			const yOffset = grid + 3, lifeHeight = 7;
			drawRect(gameWidth - 8 - lifeTotal, yOffset, lifeTotal, lifeHeight, colors.purple);
			drawRect(gameWidth - 8 - lifeTotal, yOffset + lifeHeight, lifeTotal, 1, colors.dark);
		},
		time = () => {
			if(!timeString) timeString = '00:00:00';
			writeString(timeString, gameWidth - grid * 4, 8)
		},
		gameOverScreen = () => {
			drawImg(img.screen, 0, 0);
		},
		gameOverOverlay = () => {
			const gameOverX = gameWidth / 2 - grid * 4.5, gameOverY = gameHeight / 2 - grid;
			writeString('GAME OVER', gameOverX, gameOverY, colors.yellow, true);
			writeString('PRESS SHOT TO RESTART', gameOverX - 11, gameOverY + grid * 1.5);
			// const gameOverString = 'game over',
			// 	highScoreString = 'you got a new high score';
			// const gameOverOffset = gameWidth / 2 - gameOverString.length * 8 / 2,
			// 	highScoreOffset = gameWidth / 2 - highScoreString.length * 8 / 2;
			// drawString(gameOverString, gameOverOffset, gameHeight / 2 - 8);
			// if(gotHighScore) drawString(highScoreString, highScoreOffset, gameHeight / 2 + 8, true);
		},
		lives = () => {
			for(i = 0; i < player.data.lives - 1; i++) drawImg(img.playerlife, 8 + grid * i, 4 + grid * 1.5 + 2);
		}
		if(gameOver) gameOverScreen();
		score();
		time();
		if(bossData) boss();
		if(player.data.lives) lives();
		if(gameOver) gameOverOverlay();

	}

};