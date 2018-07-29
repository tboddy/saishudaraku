let starting = true;

const start = {

	menu: {
		current: 0,
		limit: 3,
		items: [
			{str: 'START GAME', target: 'menuStartGame'},
			{str: 'HIGH SCORES', target: 'menuScores'},
			{str: 'OPTIONS', target: 'menuOptions'},
			{str: 'QUIT', target: 'menuQuit'},
		]
	},

	subActive: false,

	changeOption(dir){
		if(!start.subActive){
			dir == 'up' ? start.menu.current-- : start.menu.current++;
			if(start.menu.current < 0) start.menu.current = start.menu.limit;
			else if(start.menu.current > start.menu.limit) start.menu.current = 0;
			start.renderMenu();
		}
	},

	doMenu(){
		if(start.subActive){
			start.subActive = false;
			$('#scores').hide();
			$('#options').hide();
			$('#menu').show();
		} else {
			switch(start.menu.current){
				case 0: start.startGame(); break;
				case 1: start.doScores(); break;
				case 2: start.doOptions(); break;
				case 3: start.quitGame(); break;
			};
		}
	},

	startGame(){
		starting = false;
		$('#start').remove();
		$('#game').show();
		$('#sidebar').show();
	},

	doScores(){
		start.subActive = true;
		$('#menu').hide();
		$('#scores').show();
	},

	doOptions(){
		start.subActive = true;
		$('#menu').hide();
		$('#options').show();
	},

	quitGame(){
		app.quit()
	},

	renderMenu(){
		start.menu.items.forEach((item, index) => {
			utilities.drawStringCss(item.str, item.target, index == start.menu.current);
		});
	},

	renderScores(){
		utilities.drawStringCss('CURRENT HIGH SCORE', 'startScoreLabel');
		utilities.drawStringCss(chrome.processScore(highScore), 'startScoreCount');
		utilities.drawStringCss('BACK', 'startScoreBack', true);
	},

	renderOptions(){
		// utilities.drawStringCss('TOGGLE FULLSCREEN', 'startOptionsFullscreen', true);
		utilities.drawStringCss('BACK', 'startOptionsBack', true);
	},

	renderVersion(){
		utilities.drawStringCss(versionNum, 'startVersion', true);
	},

	init(){
		start.renderMenu();
		start.renderScores();
		start.renderOptions();
		start.renderVersion();
	}

};