const boxSize = 4, boxOffset = 12;

const player = {

	data: {
		size: {x: 28, y: 42},
		position: {x: gameWidth / 2 - 28 / 2, y: gameHeight - 42 - grid},
		moving: {up: false, down: false, left: false, right: false},
		shooting: false,
		shotClock: 0,
		shotTime: 4,
		shotLimit: 8,
		slowHeight: 0,
		focus: false,
		focusData: false,
		focusMax: 0,
		focusGrow: 18,
		speed: 3,
		speedSlow: 1,
		powerClock: 0,
		powerInterval: 140,
		powerLevel: 1,
		gameOverTime: false,
		gameOverLimit: 60 * 10,
		moveOffset: 1,
		lives: 3
	},

	update(){

		var speed = player.data.focus ? player.data.speedSlow : player.data.speed;
		if(player.data.moving.left) player.data.position.x -= speed;
		else if(player.data.moving.right) player.data.position.x += speed;
		if(player.data.moving.up) player.data.position.y -= speed;
		else if(player.data.moving.down) player.data.position.y += speed;

		if(player.data.position.x < 0) player.data.position.x = 0;
		else if(player.data.position.x + player.data.size.x > gameWidth) player.data.position.x = gameWidth - player.data.size.x;
		if(player.data.position.y < 0) player.data.position.y = 0;
		else if(player.data.position.y + player.data.size.y > gameHeight) player.data.position.y = gameHeight - player.data.size.y;

		if(player.data.powerClock){
			if(player.data.powerClock % player.data.powerInterval == 0 && player.data.powerClock != player.data.powerInterval * 5) player.data.powerLevel--;
			player.data.powerClock--;
		}

		player.data.focusMax = gameHeight - (gameHeight - player.data.position.y) - 4;

		if(gameOver) {
			player.data.position = {x: gameWidth / 2 - 28 / 2, y: gameHeight - 42 - grid};
			if(!player.data.gameOverTime) player.data.gameOverTime = gameClock;
			if(gameClock == player.data.gameOverTime + player.data.gameOverLimit) location.reload();
		}

	},

	draw(){
		if(gameOver){

		} else {
			const focus = () => {
				let focusX = player.data.position.x + player.data.size.x / 2 - 3;
				if(player.data.moving.left) focusX -= player.data.moveOffset;
				else if(player.data.moving.right) focusX += player.data.moveOffset;
				drawImg(img.focus, focusX, player.data.position.y + 12);
			}, yinYangs = ()=> {
				const yinYangSize = 16, yinYangTime = 60, xOffset = 3;
				let yOffset = player.data.position.y + player.data.size.y / 2 - yinYangSize / 2;
				if(gameClock % yinYangTime > yinYangTime / 2) yOffset--;
				let extraOffset = player.data.moving.left ? 1 : 0;
				if(player.data.moving.right) extraOffset = -1;
				drawImg(img.yinYang, player.data.position.x - yinYangSize - xOffset + extraOffset, yOffset)
				drawImg(img.yinYang, player.data.position.x + player.data.size.x + xOffset + extraOffset, yOffset)
			};
			let xOffset = 0;
			if(player.data.moving.left) xOffset = player.data.size.x;
			else if(player.data.moving.right) xOffset = player.data.size.x * 2
			context.drawImage(img.player, xOffset, 0, 28, 42, player.data.position.x, player.data.position.y, player.data.size.x, player.data.size.y);
			yinYangs();
			if(player.data.focus) focus();
		}
	}

};