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
		}, boss = () => {
			const lifeWidth = grid * 4;
			let lifeNum = bossData.life / 100;
			if(bossData.name == 'merlin') lifeNum = lifeNum / 3 * 2;
			const lifeTotal = Math.round(lifeWidth * lifeNum);
			const yOffset = grid + 3, lifeHeight = 7;
			const y = 22, height = 9;
			drawRect(gameWidth - 8 - lifeTotal, y, lifeTotal, height, colors.red)
			drawRect(gameWidth - 8 - lifeTotal, y + height, lifeTotal, 1, colors.dark)
		}, time = () => {
			if(!timeString) timeString = '0:00:00';
			utilities.drawString(timeString, gameWidth - grid * 3.5 - 8, 4)
		}, gameOverScreen = () => { drawImg(img.screen, 0, 0);
		}, gameOverOverlay = () => {
			const gameOverY = gameHeight / 2 - grid * 2, gameOverStr = 'GAME OVER', restartStr = 'Press Shot to Restart';
			utilities.drawString(gameOverStr, utilities.centerTextX(gameOverStr), gameOverY, true);
			utilities.drawString(restartStr, utilities.centerTextX(restartStr), gameOverY + 14);
			if(gotHighScore){
				const highStr = 'You Got a New High Score', scoreStr = chrome.processScore(highScore)
				utilities.drawString(highStr, utilities.centerTextX(highStr), gameOverY + 14 * 2 + 8, true);
				utilities.drawString(scoreStr, utilities.centerTextX(scoreStr), gameOverY + 14 * 3 + 8);
			}
		}, lives = () => {
			for(i = 0; i < player.data.lives - 1; i++) drawImg(img.playerlife, 8 + (grid + 2) * i, grid * 3 + 2);
		}, power = () => {
			let power = String(player.data.powerLevel) + '%';
			if(player.data.powerLevel < 10) power = '0' + power;
			utilities.drawString(power, 6, grid * 2);
		}
		if(gameOver) gameOverScreen();
		score();
		time();
		power();
		if(bossData) boss();
		if(player.data.lives) lives();
		if(gameOver) gameOverOverlay();

	}

};