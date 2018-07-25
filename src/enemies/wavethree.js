enemies.data.five = pos => {
	const id = randomId();
	const enemyObj = {
		id: id,
		size: {x: 22, y: 28},
		image: img.enemyGirlTwo,
		speed: 5,
		speedMod: 0.125,
		shotInterval: 12,
		health: 8,
		sprayAngle: 0,
		angleOffset: -0.03,
		limit: 180,
		clock: 0,
		score: 5500
	};
	enemyObj.position = {x: pos, y: -enemyObj.size.y};
	if(pos > gameWidth / 2) enemyObj.angleOffset = -enemyObj.angleOffset;
	enemyObj.update = () => {
		const enemy = enemies.dump[id];
		if(enemy.speed > 0 && enemy.clock < enemy.limit){
			enemy.position.y += enemy.speed;
			enemy.speed -= enemy.speedMod;
		} else if(enemy.clock % enemy.shotInterval == 0 && enemy.clock < enemy.limit) {
			const sprayCount = 6;
			for(i = 0; i < sprayCount; i++){
				bulletsEnemies.spawn('enemyFive', enemy);
				enemy.sprayAngle += Math.PI / sprayCount * 2 + enemy.angleOffset;
			}
			spawnSound.bulletOne()
		} else if(enemy.clock >= enemy.limit){
			enemy.position.y -= enemy.speed;
			enemy.speed += enemy.speedMod;
		}
		enemy.clock++;
	};
	return enemyObj;
};

enemies.data.six = pos => {
	const id = randomId();
	const enemyObj = {
		id: id,
		size: {x: 18, y: 26},
		image: img.enemyGirlOne,
		speed: 1.5,
		health: 8,
		position: {x: pos.x, y: pos.y},
		shotInterval: 45,
		sprayAngle: 0,
		clock: 0,
		score: 3500
	};
	enemyObj.update = () => {
		const enemy = enemies.dump[id];
		enemy.position.x += pos.x > 0 ? -enemy.speed : enemy.speed;
		if(enemy.clock % enemy.shotInterval == 0){
			const sprayCount = 10;
			for(i = 0; i < sprayCount; i++){
				if(i < sprayCount / 2 + 1) bulletsEnemies.spawn('enemySix', enemy);
				enemy.sprayAngle += Math.PI / sprayCount * 2;
			}
			spawnSound.bulletTwo()
		}
		enemy.clock++;
	};
	return enemyObj;
};

enemies.waves.five = () => {
	bulletsEnemies.dump = {};
	bossData = false;
	const timeout = 350;
	enemies.spawn(enemies.data.five(grid * 2));
	setTimeout(() => {
		enemies.spawn(enemies.data.five(gameWidth - grid * 2 - 22));
		currentWave = 'six';
	}, timeout);
};

enemies.waves.six = () => {
	const timeout = 500;
	enemies.spawn(enemies.data.six({x: -18, y: grid * 3.5}));
	setTimeout(() => { enemies.spawn(enemies.data.six({x: -18, y: grid * 4})); }, timeout);
	setTimeout(() => { enemies.spawn(enemies.data.six({x: -18, y: grid * 4.5})); }, timeout * 2);
	setTimeout(() => { enemies.spawn(enemies.data.six({x: gameWidth, y: grid * 3.5})); }, timeout * 3);
	setTimeout(() => { enemies.spawn(enemies.data.six({x: gameWidth, y: grid * 4})); }, timeout * 4);
	setTimeout(() => {
		enemies.spawn(enemies.data.six({x: gameWidth, y: grid * 5}));
		currentWave = 'merlin';
	}, timeout * 5);
};