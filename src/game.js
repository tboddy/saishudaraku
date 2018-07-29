const updateLoop = () => {
	background.update();
	player.update();
	drop.update();
	bulletsPlayer.update();
	bulletsEnemies.update();
	enemies.update();
	pointChrome.update();
	explosions.update();
	chrome.update();
	collisions.update();
},

drawLoop = () => {
	background.draw();
	player.draw();
	bulletsPlayer.draw();
	drop.draw();
	bulletsEnemies.draw();
	enemies.draw();
	pointChrome.draw();
	explosions.draw();
	chrome.draw();
	// collisions.draw();
},

gameLoop = () => {
	clearGame();
	if(starting){
		start.init();
		// start.update();
		// start.draw();
	} else {
		updateLoop();
		drawLoop();
		gameClock++;
	}
	window.requestAnimationFrame(gameLoop);
},

initGame = () => {
	context.imageSmoothingEnabled = false;
	storage.get('savedData', (err, data) => {
		savedData = data;
		if(savedData.highScore) highScore = savedData.highScore;
		$(window).resize(resizeGame);
		mapControls();
		collisions.setup();
		canvasEl.show();
		gameLoop();
	});
}