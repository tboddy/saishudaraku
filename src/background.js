const starTime = 5;

const background = {

	stars: {},

	spawnStar(){
		const isAlt = Math.floor(Math.random() * 3);
		const size = !isAlt ? 4 : 2;
		const starObj = {
			position: {x: Math.floor(Math.random() * (gameWidth * 2)), y: -size},
			speed: isAlt ? 4 : 10,
			size: size,
			id: randomId()
		};
		background.stars[starObj.id] = starObj
	},

	update(){
		const updateStar = star => {
			star.position.y += star.speed;
			star.position.x -= star.speed / 2
			if(star.position.y >= gameHeight) delete background.stars[star.id]
		};
		for(star in background.stars) updateStar(background.stars[star]);
		if(gameClock % starTime == 0) background.spawnStar();
	},

	draw(){
		const drawStar = star => {
			drawRect(star.position.x, star.position.y, star.size, star.size, colors.blue);
		};
		drawRect(0, 0, gameWidth, gameHeight, colors.dark)
		for(star in background.stars) drawStar(background.stars[star]);
	}

};