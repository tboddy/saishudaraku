const updateLoop = () => {
	background.update();
	player.update();
	bulletsEnemies.update();
	enemies.update();
	bulletsPlayer.update();
	drop.update();
	explosions.update();
	chrome.update();
	collisions.update();
},

drawLoop = () => {
	background.draw();
	player.draw();
	bulletsEnemies.draw();
	enemies.draw();
	bulletsPlayer.draw();
	drop.draw();
	explosions.draw();
	chrome.draw();
	// collisions.draw();
},

gameLoop = () => {
	clearGame();
	if(starting){
		start.update();
		start.draw();
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