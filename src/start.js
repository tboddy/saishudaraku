let starting = true;

const start = {

	update(){

	},

	draw(){

		const logo = () => {
			const x = gameWidth / 2 - 192 / 2, y = grid * 1.5;
			drawImg(img.startLogo, x, y);
		}, prompt = () => {
			const str = 'press shot', y = grid * 7;
			utilities.drawString(str.toUpperCase(), utilities.centerTextX(str), y, true);
		}, score = () => {
			const str = 'Current High Score', y = grid * 8.5, scoreStr = chrome.processScore(highScore);
			utilities.drawString(str.toUpperCase(), utilities.centerTextX(str), y);
			utilities.drawString(scoreStr, utilities.centerTextX(scoreStr), y + grid);
		}, instructions = () => {
			const strs = [
				'stick: move 8 directions',
				'pad a/x: shot',
				'pad b/y: focus',
				'start: Restart'
				// 'F: Fullscreen'
			], y = grid * 11;
			strs.forEach((str, i) => {
				utilities.drawString(str.toUpperCase(), utilities.centerTextX(str), y + grid * i);
			});
		}, credit = () => {
			const str = '2018 peace research'.toUpperCase(), y = gameHeight - grid * 3.5,
				verStr = 'build 18.7.23-FUCN'.toUpperCase();
			utilities.drawString(str, utilities.centerTextX(str), y, true);
			utilities.drawString(verStr, utilities.centerTextX(verStr), y + grid, true);
		};

		drawImg(img.start, 0, 0);
		logo();
		prompt();
		instructions();
		credit();
		score();
		
	}

};