let starting = true;

const start = {

	update(){

	},

	draw(){

		const logo = () => {
			const x = gameWidth / 2 - 192 / 2, y = grid * 2;
			drawImg(img.startLogo, x, y);
		}, prompt = () => {
			const str = 'PRESS SHOT';
			utilities.drawString(str, utilities.centerTextX(str), gameHeight / 2 - grid * 2, true);
		}, score = () => {
			const str = 'Current High Score', y = gameHeight / 2, scoreStr = chrome.processScore(highScore), scoreY = y + 16;
			utilities.drawString(str, utilities.centerTextX(str), y);
			utilities.drawString(scoreStr, utilities.centerTextX(scoreStr), scoreY);
		}, credit = () => {
			const str = '2018 T.B. & F.M.';
			utilities.drawString(str, utilities.centerTextX(str), gameHeight - grid * 2 - 17);
		};

		drawImg(img.start, 0, 0);
		logo();
		prompt();
		credit();
		if(highScore > 0) score();
		
	}

};