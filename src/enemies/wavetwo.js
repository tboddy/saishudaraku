enemies.data.three = index => {
	const id = randomId();
	const enemyObj = {
		id: id,
		size: {x: 18, y: 26},
		image: img.enemyGirlOne,
		clock: 0,
		speed: 3.25,
		speedMod: 0.07,
		health: 8,
		speedOffset: .3,
		shotInterval: 90,
		sprayAngle: Math.random() * Math.PI,
		score: 3000
	};
	enemyObj.position = {x: (grid * 3) * (index + 1) - grid * 2, y: -enemyObj.size.y};
	if(index == 0 || index == 4) enemyObj.speed += enemyObj.speedOffset;
	else if(index == 1 || index == 3) enemyObj.speed += enemyObj.speedOffset / 3;
	enemyObj.update = () => {
		const enemy = enemies.dump[id];
		if(enemy.speed > 0 && enemy.clock < 210){
			enemy.position.y += enemy.speed;
			enemy.speed -= enemy.speedMod;
		} else {
			const intervalOffset = 4;
			if(enemy.clock % enemy.shotInterval == 0 ||
				enemy.clock % enemy.shotInterval == intervalOffset ||
				enemy.clock % enemy.shotInterval == intervalOffset * 2 ||
				enemy.clock % enemy.shotInterval == intervalOffset * 3){
					const sprayCount = 8;
					for(i = 0; i < sprayCount; i++){
						bulletsEnemies.spawn('enemyThree', enemy);
						enemy.sprayAngle += Math.PI / sprayCount * 2;
					}
				spawnSound.bulletTwo()
			}
			if(enemy.clock > 210){
				enemy.position.y -= enemy.speed;
				enemy.speed += enemy.speedMod;
			}
			enemy.clock++
		}

	};
	return enemyObj;
};

enemies.data.four = isRight => {
	const id = randomId();
	const enemyObj = {
		id: id,
		size: {x: 26, y: 26},
		image: img.enemyPulse,
		clock: 0,
		health: 16,
		speedOffset: 2,
		shotInterval: 12,
		score: 5000
	};
	enemyObj.position = {x: isRight ? gameWidth - enemyObj.size.x - grid : grid, y: -enemyObj.size.y};
	enemyObj.initPosition = enemyObj.position;
	const angle = getAngle(enemyObj, player.data);
	enemyObj.speed = {x: -enemyObj.speedOffset * Math.cos(angle), y: -enemyObj.speedOffset * Math.sin(angle)};
	enemyObj.update = () => {
		const enemy = enemies.dump[id];
		enemy.position.x += enemy.speed.x;
		enemy.position.y += enemy.speed.y;
		if(enemy.clock % enemy.shotInterval == 0){
			bulletsEnemies.spawn('enemyFour', enemy);
			bulletsEnemies.spawn('enemyFour', enemy, {left: true});
			bulletsEnemies.spawn('enemyFour', enemy, {right: true});
			spawnSound.bulletThree()
		}
		enemy.clock++;
	};
	return enemyObj;
};

enemies.waves.three =() => {
	bulletsEnemies.dump = {};
	bossData = false;
	for(i = 0; i < 5; i++) enemies.spawn(enemies.data.three(i));
	currentWave = 'four';
};

enemies.waves.four =() => {
	enemies.spawn(enemies.data.four());
	const timeout = 1000;
	setTimeout(() => {
		enemies.spawn(enemies.data.four(true));
		currentWave = 'lyrica';
	}, timeout);
};