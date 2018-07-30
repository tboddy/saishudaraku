const totalTime = 80 * 60;

// const totalTime = 120;

let bossData = false, timeLeft = totalTime, timeString = String(totalTime), savedScore = false, gotHighScore = false, uiStarted = false,
	gameOverStarted = false;

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
				utilities.drawStringCssBig('hiscore', 'highScoreLabel');
				utilities.drawStringCssBig('score', 'scoreLabel');
				utilities.drawStringCssBig(chrome.processScore(highScore), 'highScoreCount');
			}
			if(currentScore >= highScore) utilities.drawStringCssBig(chrome.processScore(highScore), 'highScoreCount');
			utilities.drawStringCssBig(chrome.processScore(currentScore), 'scoreCount');
		}, time = () => {
			if(!uiStarted) utilities.drawStringCssBig('time', 'timeLabel');
			if(!timeString) timeString = '0:00:00';
			utilities.drawStringCssBig(timeString, 'timeCount');
		}, lives = () => {
			if(!uiStarted) utilities.drawStringCssBig('player', 'playerLabel');
			let livesStr = '';
			if(player.data.lives) for(i = 0; i < player.data.lives - 1; i++) livesStr += '<img src="img/playerlife.png" />'
			document.getElementById('playerCount').innerHTML = livesStr;
		}, power = () => {
			if(!uiStarted) utilities.drawStringCssBig('power', 'powerLabel');
			let powerStr = String(player.data.powerLevel) + '%';
			if(player.data.powerLevel < 10) powerStr = '0' + powerStr;
			else if(player.data.powerLevel == 100) powerStr = 'max';
			utilities.drawStringCssBig(powerStr, 'powerCount');
		}, version = () => {
			utilities.drawStringCssBig(versionNum, 'versionNumber', 'red');
		}, gameOverOverlay = () => {
			$('#gameOverScreen').css('display', 'flex');
			utilities.drawStringCssBig((finishedGame ? 'level over' : 'game over'), 'gameOverLabel');
			utilities.drawStringCssBig('press shot', 'restartOverLabel', 'red');
			utilities.drawStringCssBig('to restart', 'restartOverLabelTwo', 'red');
			if(gotHighScore){
				$('#gameOverHighScore').css('display', 'flex');
				utilities.drawStringCssBig('congratulations', 'congratsOverLabel');
				utilities.drawStringCssBig('you got the', 'scoreOverLabel');
				utilities.drawStringCssBig('high score', 'scoreOverLabelTwo');
				utilities.drawStringCssBig('high score', 'scoreOverLabelTwo');
				utilities.drawStringCssBig(chrome.processScore(highScore), 'scoreOverCount');
			}
			gameOverStarted = true;
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
		if(bossData) boss();
		if(gameOver && !gameOverStarted) gameOverOverlay();
		if(!uiStarted){
			version();
			uiStarted = true;
		}


	}

};