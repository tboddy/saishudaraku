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
			const y = 4;
			utilities.drawString('score'.toUpperCase(), 6, 4, true);
			utilities.drawString(chrome.processScore(currentScore), 6, 4 + grid);
			const highStr = 'high'.toUpperCase(), scoreStr = chrome.processScore(highScore);
			utilities.drawString(highStr, utilities.centerTextX(highStr), y, true);
			utilities.drawString(scoreStr, utilities.centerTextX(scoreStr), y + grid);
		}, boss = () => {
			const height = 9, width = grid * 4, y = grid + 8, x = gameWidth - 8 - width;
			let lifeNum = Math.round(width * (bossData.life / bossData.lifeMax));
			if(lifeNum < 0) lifeNum = 0;
			drawRect(x, y, width, height, colors.purple)
			drawRect(x + (width - lifeNum), y, lifeNum, height, colors.red)
			drawRect(x, y + height, width, 1, colors.dark)
		}, time = () => {
			if(!timeString) timeString = '0:00:00';
			utilities.drawString(timeString, gameWidth - grid * 3.5 - 8, 4)
		}, gameOverScreen = () => { drawImg(img.screen, 0, 0);
		}, gameOverOverlay = () => {
			const gameOverStr = finishedGame ? 'level over' : 'game over',
			gameOverY = gameHeight / 2 - grid * 3, restartStr = 'Press Shot to Restart';
			utilities.drawString(gameOverStr.toUpperCase(), utilities.centerTextX(gameOverStr), gameOverY,);
			utilities.drawString(restartStr.toUpperCase(), utilities.centerTextX(restartStr), gameOverY + grid, true);
			if(gotHighScore){
				const contratsStr = 'congratulations'.toUpperCase(), highStr = 'You Got the High Score'.toUpperCase(),
					scoreStr = chrome.processScore(highScore), scoreY = gameOverY + grid * 3;
				utilities.drawString(contratsStr, utilities.centerTextX(contratsStr), scoreY);
				utilities.drawString(highStr, utilities.centerTextX(highStr), scoreY + grid);
				utilities.drawString(scoreStr, utilities.centerTextX(scoreStr), scoreY + grid * 2);
			}
		}, lives = () => {
			const y = grid * 3 + 8;
			for(i = 0; i < player.data.lives - 1; i++) drawImg(img.playerlife, 8 + (grid + 2) * i, y);
		}, power = () => {
			let power = String(player.data.powerLevel) + '%';
			if(player.data.powerLevel < 10) power = '0' + power;
			utilities.drawString(power, 6, grid * 2 + 4);
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