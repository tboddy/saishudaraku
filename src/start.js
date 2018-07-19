const start = {

	update(){

	},

	draw(){

		const logo = () => {
			const x = gameWidth / 2 - 192 / 2, y = grid * 2;
			drawImg(img.startLogo, x, y);
		}, prompt = () => {
			const x = gameWidth / 2 - grid * 2.5 + 2, y = gameHeight / 2 - grid * 1.5;
			writeString('PRESS SHOT', x, y, colors.red);
		}, score = () => {
			const x = gameWidth / 2 - grid * 4 - 4, y = gameHeight / 2 + grid;
			writeString('CURRENT HIGH SCORE', x, y);
			writeString(chrome.processScore(highScore), x + grid + 8, y + 10, colors.light, true);
		}, credit = () => {
			const x = gameWidth / 2 - grid * 3 - 4, y = gameHeight - grid * 2 - 8;
			writeString('2018 T.B. & F.M.', x, y);
		};

		drawImg(img.start, 0, 0);
		logo();
		prompt();
		credit();
		if(highScore > 0) score();
		
	}

};