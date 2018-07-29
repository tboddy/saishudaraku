const totalTime = 80 * 60, sidebarWidth = winWidth - gameWidth, sidebarX = gameWidth, chromeX = sidebarX + 7 + 8,
	scoreX = chromeX + grid * 7 - 5 - 8;

// const totalTime = 120;

let bossData = false, timeLeft = totalTime, timeString = String(totalTime), savedScore = false, gotHighScore = false, uiStarted = false;

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
		const score = () => {
			if(!uiStarted){
				utilities.drawStringCss('HISCORE', 'highScoreLabel');
				utilities.drawStringCss('SCORE', 'scoreLabel');
				utilities.drawStringCss(chrome.processScore(highScore), 'highScoreCount');
			}
			if(currentScore >= highScore) utilities.drawStringCss(chrome.processScore(highScore), 'highScoreCount');
			utilities.drawStringCss(chrome.processScore(currentScore), 'scoreCount');
		}, lives = () => {
			if(!uiStarted) utilities.drawStringCss('PLAYER', 'playerLabel');
			let livesStr = '';
			if(player.data.lives){
				for(i = 0; i < player.data.lives - 1; i++){
					livesStr += '<img src="img/playerlife.png" style="width:' + (16 * uiScale) + 'px;height:' + (16 * uiScale) + 'px" />'
				}
			}
			document.getElementById('playerCount').innerHTML = livesStr;
		}, power = () => {
			if(!uiStarted) utilities.drawStringCss('POWER', 'powerLabel');
			let powerStr = String(player.data.powerLevel) + '%';
			if(player.data.powerLevel < 10) powerStr = '0' + powerStr;
			else if(player.data.powerLevel == 100) powerStr = 'MAX';
			utilities.drawStringCss(powerStr, 'powerCount');
		}, time = () => {
			if(!uiStarted) utilities.drawStringCss('TIME', 'timeLabel');
			if(!timeString) timeString = '0:00:00';
			utilities.drawStringCss(timeString, 'timeCount');
		}, logo = () => {
			// const width = 96 * uiScale, height = 96 * uiScale;
			// $('#sidebarLogo').css('width', width + 'px').css('height', height + 'px').css('margin-left', '-' + width / 2 + 'px');
		}, version = () => {
			$('#versionNumber').css('margin-bottom', 17 * -uiScale);
			utilities.drawStringCss(versionNum, 'versionNumber');
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
		}, boss = () => {
			const height = 8, width = gameWidth - grid, y = 8, x = 8;
			let lifeNum = Math.floor(width * (bossData.life / bossData.lifeMax));
			if(lifeNum < 0) lifeNum = 0;
			drawRect(x, y, width, height, colors.purple)
			drawRect(x, y, lifeNum, height, colors.red)
			drawRect(x, y + height, width, 1, colors.dark)
		};
		score();
		lives();
		power();
		time();
		if(gameOver) gameOverScreen();
		if(bossData) boss();
		if(gameOver) gameOverOverlay();
		if(!uiStarted){
			logo();
			version();
			uiStarted = true;
		}


	}

};