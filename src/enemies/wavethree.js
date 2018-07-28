enemies.data.five = pos => {
	const id = randomId();
	const enemyObj = {
		id: id,
		size: {x: 22, y: 28},
		image: img.enemyGirlTwo,
		speed: 4.5,
		speedMod: 0.1,
		shotInterval: 12,
		health: 20,
		sprayAngle: 0,
		angleOffset: -0.03,
		limit: 60 * 4,
		clock: 0,
		score: 5500
	};
	enemyObj.position = {x: pos, y: -enemyObj.size.y};
	if(pos > gameWidth / 2){
		enemyObj.angleOffset = -enemyObj.angleOffset;
		enemyObj.position.y -= grid * 3
	}
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
			if(enemy.position.y + enemy.size.y > 0) enemy.speed += enemy.speedMod;
		}
		enemy.clock++;
	};
	return enemyObj;
};

enemies.data.six = opts => {
	const id = randomId();
	const enemyObj = {
		id: id,
		size: {x: 18, y: 26},
		image: img.enemyGirlOne,
		speed: 2,
		health: 5,
		isRed: opts.isRed,
		position: {x: opts.position.x, y: opts.position.y},
		shotInterval: 45,
		sprayAngle: 0,
		clock: 0,
		score: 3500
	};
	enemyObj.update = () => {
		const enemy = enemies.dump[id];
		enemy.position.x += opts.position.x > 0 ? -enemy.speed : enemy.speed;
		if(enemy.clock % enemy.shotInterval == 0){
			const sprayCount = 12;
			for(i = 0; i < sprayCount; i++){
				if(i <= sprayCount / 2 - 1 && i > 0) bulletsEnemies.spawn('enemySix', enemy);
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
	enemies.spawn(enemies.data.five(grid * 2.5));
	enemies.spawn(enemies.data.five(gameWidth - grid * 2.5 - 22));
	currentWave = 'six';
};

enemies.waves.six = () => {
	enemies.spawn(enemies.data.six({position: {x: -18, y: grid * 2}}));
	enemies.spawn(enemies.data.six({position: {x: -18 - grid * 5, y: grid * 3.5}}));
	enemies.spawn(enemies.data.six({position: {x: -18 - grid * 10, y: grid * 5}}));
	const rOffset = gameWidth + grid * 20;
	enemies.spawn(enemies.data.six({position: {x: rOffset, y: grid * 2}, isRed: true}));
	enemies.spawn(enemies.data.six({position: {x: rOffset + grid * 5, y: grid * 3.5}, isRed: true}));
	enemies.spawn(enemies.data.six({position: {x: rOffset + grid * 10, y: grid * 5}, isRed: true}));
	currentWave = 'merlin';

};