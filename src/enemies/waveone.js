enemies.data.one = pos => {
	const id = randomId();
	const enemyObj = {
		id: id,
		isLeft: pos > gameWidth / 2,
		size: {x: 18, y: 26},
		destination: {
			size: {x: player.data.size.x, y: player.data.size.y},
			position: {x: player.data.position.x, y: player.data.position.y}
		},
		image: img.enemyGirlOne,
		finished: false,
		angle: 0,
		clock: 0,
		health: 4,
		speedMod: 0.025,
		score: 1500
	};
	enemyObj.speed = {x: enemyObj.isLeft ? -1 : 1, y: 1.25};
	enemyObj.position = {x: pos, y: -enemyObj.size.y};
	if(!enemyObj.isLeft) enemyObj.speedMod = -enemyObj.speedMod;
	enemyObj.update = () => {
		const enemy = enemies.dump[id];
		enemy.position.x += enemy.speed.x;
		enemy.position.y += enemy.speed.y;
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
		health: 16,
		finished: false,
		sprayAngle: 0,
		score: 5500
	};
	enemyObj.position = {x: isRight ? gameWidth - grid * 3 - enemyObj.size.x : grid * 3, y: -enemyObj.size.y};
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
	const offset = 4.5;
	const lPos = grid * offset, rPos = gameWidth - grid * offset - 18, diff = 350;
	enemies.spawn(enemies.data.one(lPos));
	setTimeout(() => { enemies.spawn(enemies.data.one(lPos)); }, diff);
	setTimeout(() => { enemies.spawn(enemies.data.one(lPos)); }, diff * 2);
	setTimeout(() => { enemies.spawn(enemies.data.one(lPos)); }, diff * 3);
	setTimeout(() => { enemies.spawn(enemies.data.one(rPos)); }, diff * 4);
	setTimeout(() => { enemies.spawn(enemies.data.one(rPos)); }, diff * 5);
	setTimeout(() => { enemies.spawn(enemies.data.one(rPos)); }, diff * 6);
	setTimeout(() => {
		enemies.spawn(enemies.data.one(rPos));
		currentWave = 'two';
	}, diff * 7);
};

enemies.waves.two = () => {
	const timeout = 350;
	enemies.spawn(enemies.data.two());
	setTimeout(() => {
		enemies.spawn(enemies.data.two(true));
		currentWave = 'lunasa';
	}, timeout);
};