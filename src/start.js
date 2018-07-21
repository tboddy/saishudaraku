let starting = true;

const start = {

	update(){

	},

	draw(){

		const logo = () => {
			const x = gameWidth / 2 - 192 / 2, y = grid * 2;
			drawImg(img.startLogo, x, y);
		}, prompt = () => {
			const str = 'PRESS SHOT', y = grid * 7 + 4;
			utilities.drawString(str, utilities.centerTextX(str), y, true);
		}, score = () => {
			const str = 'Current High Score', y = gameHeight / 2 - 12 - 4, scoreStr = chrome.processScore(highScore), scoreY = y + 16;
			utilities.drawString(str.toUpperCase(), utilities.centerTextX(str), y);
			utilities.drawString(scoreStr, utilities.centerTextX(scoreStr), scoreY);
		}, instructions = () => {
			const strs = [
				'Z: Shot',
				'x: focus',
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