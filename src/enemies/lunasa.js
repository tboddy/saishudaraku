enemies.data.lunasa = () => {
	const id = randomId();
	const enemyObj = {
		id: id,
		health: 400,
		size: {x: 26, y: 60},
		frames: true,
		moving: {left: false, right: true},
		direction: 0,
		image: img.lunasa,
		waveStarted: false,
		speed: 1.25,
		waveInterval: 60 * 5.5,
		startSpeed: 4.85,
		startSpeedDiff: 0.125,
		clock: 0,
		bobInterval: 90,
		spine: {
			size: {x: 2, y: 2},
			shotInterval: 15,
			secondShotInterval: 3,
			speedMod: 2
		},
		spray: {
			angle: 0,
			position: {x: grid * 2, y: grid * 3},
		},
		score: 20000
	};
	enemyObj.position = {x: grid * 2, y: -enemyObj.size.y};
	bossData = {
		name: 'lunasa',
		life: enemyObj.health,
		lifeMax: enemyObj.health
	};
	const spineAngle = function(enemy){
		enemy.spine.position = {
			x: enemy.position.x + enemy.size.x / 2 - enemy.spine.size.x / 2,
			y: enemy.position.y + enemy.size.y / 4 - enemy.spine.size.y / 2
		};
		enemy.spine.initPosition = {
			x: enemy.position.x + enemy.size.x / 2 - enemy.spine.size.x / 2,
			y: enemy.position.y + enemy.size.y / 4 - enemy.spine.size.y / 2
		};
		const angle = getAngle(player.data, enemy.spine);
		enemy.spine.speed = {x: enemy.spine.speedMod * Math.cos(angle), y: enemy.spine.speedMod * Math.sin(angle)};
	};
	spineAngle(enemyObj);
	enemyObj.update = () => {
		const enemy = enemies.dump[id], moveLeft = function(){
			if(enemy.moving.left) enemy.position.x -= enemy.speed;
			if(enemy.position.x <= grid * 2) enemy.moving.left = false;
		}, moveRight = () => {
			if(enemy.moving.right) enemy.position.x += enemy.speed;
			if(enemy.position.x >= gameWidth - enemy.size.x - grid * 2) enemy.moving.right = false;
		}, checkMove = () => {
			if(enemy.clock % enemy.waveInterval == 0){
				enemy.direction = !enemy.direction;
				enemy.direction ? enemy.moving.right = true : enemy.moving.left = true;
			}
			enemy.direction ? moveRight() : moveLeft();
		}, spawns = {
			spine(){
				enemy.spine.position.x += enemy.spine.speed.x;
				enemy.spine.position.y += enemy.spine.speed.y;
				if(enemy.clock % enemy.waveInterval == 0) spineAngle(enemy);
				if(enemy.spine.position.y <= gameHeight){
					if(enemy.clock % enemy.spine.shotInterval == 0){
						bulletsEnemies.spawn('lunasaSpine', enemy);
						bulletsEnemies.spawn('lunasaSpine', enemy, {left: true});
						bulletsEnemies.spawn('lunasaSpine', enemy, {right: true});
						spawnSound.bulletOne()
					}
					if(enemy.clock % enemy.spine.secondShotInterval == 0){
						bulletsEnemies.spawn('lunasaSecondSpine', enemy);
					}
				}
			},
			spray(){
				const sprayInterval = 20, homingInterval = 12;
				enemy.spray.position.x = enemy.direction ? grid * 2 : gameWidth - enemy.size.x - grid * 2;
				if(enemy.clock % enemy.waveInterval < enemy.waveInterval * .3 && enemy.clock % homingInterval == 0){
					bulletsEnemies.spawn('lunasaHoming', enemy);
					spawnSound.bulletThree()
				}
				if(enemy.clock % enemy.waveInterval < enemy.waveInterval * .6 && enemy.clock % sprayInterval == 0){
					const sprayCount = 30;
					for(i = 0; i < sprayCount; i++){
						bulletsEnemies.spawn('lunasaSpray', enemy);
						enemy.spray.angle += Math.PI / sprayCount * 2;
					}
					spawnSound.bulletTwo()
				}
			}
		}
		if(enemy.startSpeed > 0){
			enemy.position.y += enemy.startSpeed;
			enemy.startSpeed -= enemy.startSpeedDiff;
		} else {
			enemy.spray.position.y = enemy.position.y;
			checkMove();
			if(enemy.clock < enemy.waveInterval || enemy.clock >= enemy.waveInterval * 2 && enemy.clock < enemy.waveInterval * 3) spawns.spine();
			else if(enemy.clock >= enemy.waveInterval && enemy.clock < enemy.waveInterval + 180) spawns.spray();
			if(enemy.clock >= enemy.waveInterval * 4){
				enemy.moving.right = false;
				enemy.moving.left = false;
				enemy.position.x -= enemy.speed;
				enemy.position.y -= enemy.speed;
				bossData = false;
			}
			if(enemy.clock % enemy.bobInterval == 0) enemy.position.y++;
			else if(enemy.clock % enemy.bobInterval == enemy.bobInterval / 2) enemy.position.y--;
			enemy.clock++;
		}
	};
	return enemyObj;
};





// new shit


// enemies.data.lunasa = () => {
	// 	const id = randomId();
	// 	const enemyObj = {
	// 		id: id,
	// 		health: 220,
	// 		size: {x: 26, y: 60},
	// 		frames: true,
	// 		image: img.lunasa,
	// 		clock: 0,
	// 		score: 20000,
	// 		first: {
	// 			angle: 0
	// 		},
	// 		waveTime: 300
	// 	};
	// 	enemyObj.position = {x: gameWidth / 2 - enemyObj.size.x / 2, y: grid * 3};
	// 	bossData = {
	// 		name: 'lunasa',
	// 		life: enemyObj.health,
	// 		lifeMax: enemyObj.health
	// 	};
	// 	const spawns = {
	// 		first(enemy){
	// 			if(enemy.clock % 3 == 0){
	// 				const firstLimit = 50;
	// 				if(enemy.clock % firstLimit < firstLimit / 5 * 2){
	// 					const count = 12;
	// 					for(i = 0; i < count; i++){
	// 						bulletsEnemies.spawn('lunasaFirst', enemy, {angle: enemy.first.angle});
	// 						bulletsEnemies.spawn('lunasaFirst', enemy, {angle: enemy.first.angle, opposite: true});
	// 						enemy.first.angle += Math.PI / count * 2;
	// 					}
	// 				}
	// 				else if(enemy.clock % firstLimit == firstLimit / 5 * 2) enemy.first.angle += Math.PI / 35
	// 			}
	// 		},
	// 		second(enemy){
	// 			if(enemy.clock % 6 == 0) bulletsEnemies.spawn('lunasaSecond', enemy);
	// 			if(enemy.clock % 40 == 0) bulletsEnemies.spawn('lunasaSecondOrb', enemy);
	// 		},
	// 		third(enemy){
	// 			if(enemy.clock % 5 == 0) bulletsEnemies.spawn('lunasaThird', enemy);
	// 		}
	// 	};
	// 	enemyObj.update = () => {
	// 		const enemy = enemies.dump[id];
	// 		if(enemy.clock < enemy.waveTime) spawns.first(enemy);
	// 		else if(enemy.clock >= enemy.waveTime) spawns.second(enemy);
	// 		// spawns.second(enemy);
	// 		enemy.clock++;
	// 	};
	// 	return enemyObj;
	// };

// bulletsEnemies.data.lunasaFirst = (enemy, opts) => {
// 	const id = randomId(), bulletSize = 10;
// 	return {
// 		id: id,
// 		image: img.bulletBlue,
// 		size: {x: bulletSize, y: bulletSize},
// 		position: {x: enemy.position.x + enemy.size.x / 2 - bulletSize / 2, y: enemy.position.y + enemy.size.y / 2 + bulletSize / 2},
// 		speed: {x: 4, y: 4},
// 		angle: 0,
// 		update(){
// 			const bullet = bulletsEnemies.dump[id], angleDiff = 0.025;
// 			bullet.position.x += Math.cos(opts.angle + bullet.angle) * bullet.speed.x;
// 			bullet.position.y += Math.sin(opts.angle + bullet.angle) * bullet.speed.x;
// 			bullet.angle += opts.opposite ? angleDiff : -angleDiff;
// 		}
// 	}
// };

// bulletsEnemies.data.lunasaSecond = enemy => {
// 	const id = randomId(), bulletSize = 16, bulletX = enemy.position.x + enemy.size.x / 2 - bulletSize / 2,
// 		bulletY = enemy.position.y + enemy.size.y / 2 + bulletSize / 2;
// 	const bulletObj = {
// 		id: id,
// 		image: img.bulletRedBig,
// 		size: {x: bulletSize, y: bulletSize},
// 		position: {x: bulletX, y: bulletY},
// 		speed: 3.25,
// 		update(){
// 			const bullet = bulletsEnemies.dump[id];
// 			bullet.position.x += -Math.cos(bullet.angle) * bullet.speed;
// 			bullet.position.y += -Math.sin(bullet.angle) * bullet.speed;
// 		}
// 	};
// 	bulletObj.angle = getAngle(bulletObj, player.data);
// 	bulletObj.angle += Math.random() * 1.5 - 0.75;
// 	return bulletObj;
// };

// bulletsEnemies.data.lunasaSecondOrb = enemy => {
// 	const id = randomId(), bulletSize = 16;
// 	const bulletObj = {
// 		id: id,
// 		image: img.bulletBlueBig,
// 		size: {x: bulletSize, y: bulletSize},
// 		position: {x: enemy.position.x + enemy.size.x / 2 - bulletSize / 2, y: enemy.position.y + enemy.size.y / 2 + bulletSize / 2},
// 		speed: 5,
// 		speedDiff: 0.15,
// 		finished: false,
// 		update(){
// 			const bullet = bulletsEnemies.dump[id];
// 			bullet.position.x += -Math.cos(bullet.angle) * bullet.speed;
// 			bullet.position.y += -Math.sin(bullet.angle) * bullet.speed;
// 			if(bullet.speed > 0) bullet.speed -= bullet.speedDiff;
// 			else if(bullet.speed < 0) bullet.speed = 0;
// 			else if(bullet.speed == 0 && !bullet.finished){
// 				bullet.finished = true;
// 				const timeDiff = 30, opts = {
// 					angle: getAngle({
// 						position:{x: bullet.position.x + bullet.size.x / 2, y: bullet.position.y + bullet.size.y / 2},
// 						size: {x: 10, y: 10}
// 					}, player.data)
// 				};
// 				bulletsEnemies.spawn('lunasaSecondRay', bullet, opts);
// 				setTimeout(() => {bulletsEnemies.spawn('lunasaSecondRay', bullet, opts)}, timeDiff);
// 				setTimeout(() => {bulletsEnemies.spawn('lunasaSecondRay', bullet, opts)}, timeDiff * 2);
// 				setTimeout(() => {bulletsEnemies.spawn('lunasaSecondRay', bullet, opts);}, timeDiff * 3);
// 				setTimeout(() => {bulletsEnemies.spawn('lunasaSecondRay', bullet, opts);}, timeDiff * 4);
// 				// explosions.spawn(
// 				// 	{},
// 				// 	{x: player.data.position.x, y: player.data.position.y, height: player.data.size.y, width: player.data.size.x}
// 				// 	);

// 				delete bulletsEnemies.dump[id];
// 			}
// 		}
// 	}, angleObj = {
// 		position: {x: Math.floor(Math.random() * gameWidth) + 1, y: Math.floor(Math.random() * gameHeight / 3) + 1},
// 		size: {x: 2, y: 2}
// 	};
// 	bulletObj.angle = getAngle(bulletObj, angleObj);
// 	return bulletObj;
// };

// bulletsEnemies.data.lunasaSecondRay = (parent, opts) => {
// 	const bulletSize = 10, id = randomId();
// 	const bulletObj = {
// 		id: id,
// 		image: img.bulletBlue,
// 		size: {x: bulletSize, y: bulletSize},
// 		position: {x: parent.position.x + parent.size.x / 2, y: parent.position.y + parent.size.y / 2},
// 		speed: -0.5,
// 		speedDiff: 0.05,
// 		update(){
// 			const bullet = bulletsEnemies.dump[id];
// 			bullet.position.x += -Math.cos(opts.angle) * bullet.speed;
// 			bullet.position.y += -Math.sin(opts.angle) * bullet.speed;
// 			bullet.speed += bullet.speedDiff;
// 		}
// 	};
// 	return bulletObj;
// };

enemies.waves.lunasa = () => {
	enemies.spawn(enemies.data.lunasa());
	currentWave = 'three';
};