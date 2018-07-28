enemies.data.one = pos => {
	const id = randomId();
	const enemyObj = {
		id: id,
		isLeft: pos.x > gameWidth / 2,
		size: {x: 18, y: 26},
		destination: {
			size: {x: player.data.size.x, y: player.data.size.y},
			position: {x: player.data.position.x, y: player.data.position.y}
		},
		image: img.enemyGirlOne,
		finished: false,
		angle: 0,
		clock: 0,
		health: 5,
		speedMod: 0.04,
		score: 1500,
		position: pos
	};
	enemyObj.speed = {x: enemyObj.isLeft ? -1.35 : 1.35, y: 1.4};
	enemyObj.position.x -= enemyObj.size.x / 2;
	enemyObj.position.y -= enemyObj.size.y / 2;
	if(!enemyObj.isLeft) enemyObj.speedMod = -enemyObj.speedMod;
	enemyObj.update = () => {
		const enemy = enemies.dump[id];
		enemy.position.y += enemy.speed.y;

		if(enemy.shown){
			enemy.position.x += enemy.speed.x;
			enemy.speed.x += enemyObj.speedMod;
			if(enemy.clock == 30 && !enemy.finished){
				enemy.finished = true;
				modifiedAngle = 0;
				bulletsEnemies.spawn('enemyOne', enemy);
				bulletsEnemies.spawn('enemyOne', enemy);
				bulletsEnemies.spawn('enemyOne', enemy);
				bulletsEnemies.spawn('enemyOne', enemy);
				spawnSound.bulletOne()
			};
			enemy.clock++;
		}

	}
	return enemyObj;
};

enemies.data.two = isRight => {
	const id = randomId(), speed = 4;
	const enemyObj = {
		id: id,
		size: {x: 22, y: 28},
		image: img.enemyGirlTwo,
		speed: 3.25,
		speedMod: 0.04,
		clock: 0,
		health: 20,
		finished: false,
		sprayAngle: 0,
		score: 5500
	};
	enemyObj.position = {x: isRight ? gameWidth - grid * 3 - enemyObj.size.x : grid * 3, y: -enemyObj.size.y};
	if(isRight) enemyObj.position.y *= 2.5;
	enemyObj.update = () => {
		const enemy = enemies.dump[id];
		enemy.position.y += enemy.speed;
		enemy.speed -= enemy.speedMod;
		if(enemy.speed < 0 && !enemy.finished){
			enemy.finished = true;
			const sprayCount = 20, homingInterval = 150, spawnSpray = () => {
				for(i = 0; i < sprayCount; i++){
					bulletsEnemies.spawn('enemyTwoSpray', enemy);
					enemy.sprayAngle += Math.PI / sprayCount * 2;
				}
			};
			spawnSpray();
			setTimeout(spawnSpray, homingInterval * 2);
			bulletsEnemies.spawn('enemyTwoHoming', enemy);
			setTimeout(() => {bulletsEnemies.spawn('enemyTwoHoming', enemy)}, homingInterval);
			setTimeout(() => {bulletsEnemies.spawn('enemyTwoHoming', enemy)}, homingInterval * 2);
			setTimeout(() => {bulletsEnemies.spawn('enemyTwoHoming', enemy)}, homingInterval * 3);
			setTimeout(() => {bulletsEnemies.spawn('enemyTwoHoming', enemy)}, homingInterval * 4);
			spawnSound.bulletTwo()
		}
		enemy.clock++;
	};
	return enemyObj;
};

enemies.waves.one = () => {
	const yOffset = grid * 8;
	const lX = grid * 4.5, lY = -grid * 2, rX = gameWidth - lX - 18, rY = lY - yOffset, lYB = rY - yOffset;
	enemies.spawn(enemies.data.one({x: lX, y: lY}));
	enemies.spawn(enemies.data.one({x: lX, y: lY - grid * 2}));
	enemies.spawn(enemies.data.one({x: lX, y: lY - grid * 4}));
	enemies.spawn(enemies.data.one({x: rX, y: rY}));
	enemies.spawn(enemies.data.one({x: rX, y: rY - grid * 2}));
	enemies.spawn(enemies.data.one({x: rX, y: rY - grid * 4}));
	enemies.spawn(enemies.data.one({x: lX, y: lYB}));
	enemies.spawn(enemies.data.one({x: lX, y: lYB - grid * 2}));
	enemies.spawn(enemies.data.one({x: lX, y: lYB - grid * 4}));
	currentWave = 'two';
};

enemies.waves.two = () => {
	const timeout = 350;
	enemies.spawn(enemies.data.two());
	enemies.spawn(enemies.data.two(true));
	currentWave = 'lunasa';
};