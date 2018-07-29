const totalTime = 75 * 60, sidebarWidth = winWidth - gameWidth, sidebarX = gameWidth, chromeX = sidebarX + 7 + 8,
	scoreX = chromeX + grid * 7 - 5 - 8;

// const totalTime = 120;

let bossData = false, timeLeft = totalTime, timeString = String(totalTime), savedScore = false, gotHighScore = false;

const chrome = {

	processScore(input){
		let scoreString = String(input);
		for(j = scoreString.length; j < 7; j++){
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
		const bg = () => {
			drawImg(img.sidebar, sidebarX, 0);
		}, logo = () => {
			drawImg(img.sidebarLogo, sidebarX, grid * 9);
		}, score = () => {
			const y = 12;
			utilities.drawString('hiscore'.toUpperCase(), chromeX, y);
			utilities.drawString('score'.toUpperCase(), chromeX, y + grid);
			utilities.drawString(chrome.processScore(highScore), scoreX, y);
			utilities.drawString(chrome.processScore(currentScore), scoreX, y + grid);
		}, time = () => {
			if(!timeString) timeString = '0:00:00';
			const y = 12 + grid * 2.5;
			utilities.drawString('time'.toUpperCase(), chromeX, y);
			utilities.drawString(timeString, scoreX, y)
		}, gameOverScreen = () => { drawImg(img.screen, 0, 0);
		}, gameOverOverlay = () => {
			const gameOverStr = finishedGame ? 'level over' : 'game over',
			gameOverY = gameHeight / 2 - grid * 3, restartStr = 'Press Shot to Restart';
			utilities.drawString(gameOverStr.toUpperCase(), utilities.centerTextX(gameOverStr, true), gameOverY,);
			utilities.drawString(restartStr.toUpperCase(), utilities.centerTextX(restartStr, true), gameOverY + grid, true);
			if(gotHighScore){
				const contratsStr = 'congratulations'.toUpperCase(), highStr = 'You Got the High Score'.toUpperCase(),
					scoreStr = chrome.processScore(highScore), scoreY = gameOverY + grid * 3;
				utilities.drawString(contratsStr, utilities.centerTextX(contratsStr, true), scoreY);
				utilities.drawString(highStr, utilities.centerTextX(highStr, true), scoreY + grid);
				utilities.drawString(scoreStr, utilities.centerTextX(scoreStr, true), scoreY + grid * 2);
			}
		}, lives = () => {
			const y = 12 + grid * 3.5;
			utilities.drawString('player'.toUpperCase(), chromeX, y);
			for(i = 0; i < player.data.lives - 1; i++) drawImg(img.playerlife, scoreX + grid * i, y + 1);
		}, power = () => {
			const y = 12 + grid * 4.5;
			let power = String(player.data.powerLevel) + '%';
			if(player.data.powerLevel < 10) power = '0' + power;
			if(player.data.powerLevel == 100) power = 'MAX';
			utilities.drawString('power'.toUpperCase(), chromeX, y);
			utilities.drawString(power, scoreX, y);
		}, version = () => {
			const vStr = 'v' + versionNum.toUpperCase();
			utilities.drawString(vStr,utilities.centerTextX(vStr, false, true), gameHeight - grid * 1.5 - 6, true);
		}, boss = () => {
			const height = 8, width = gameWidth - grid * 2, y = grid, x = grid;
			let lifeNum = Math.floor(width * (bossData.life / bossData.lifeMax));
			if(lifeNum < 0) lifeNum = 0;
			drawRect(x, y, width, height, colors.purple)
			drawRect(x, y, lifeNum, height, colors.red)
			drawRect(x, y + height, width, 1, colors.dark)
		};

		bg();
		logo();
		score();
		if(player.data.lives) lives();
		power();
		time();
		version();

		if(gameOver) gameOverScreen();
		if(bossData) boss();
		if(gameOver) gameOverOverlay();

	}

};