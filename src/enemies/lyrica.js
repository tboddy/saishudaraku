enemies.data.lyrica = () => {
	const id = randomId();
	const enemyObj = {
		id: id,
		health: 500,
		size: {x: 32, y: 60},
		frames: true,
		moving: {left: false, right: true},
		direction: 0,
		image: img.lyrica,
		waveStarted: false,
		speed: 1.25,
		startSpeed: 4.85,
		startSpeedDiff: 0.125,
		waveInterval: 60 * 5.5,
		clock: 0,
		spray: {
			angle: 0,
			interval: 15,
			index: 0,
			position: {x: grid * 2, y: grid * 3},
		},
		bobInterval: 90,
		score: 30000
	};
	enemyObj.position = {x: grid * 2, y: -enemyObj.size.y};
	bossData = {
		name: 'lyrica',
		life: enemyObj.health,
		lifeMax: enemyObj.health
	};
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
			spray(){
				enemy.spray.position.x = enemy.direction ? grid * 2 : gameWidth - enemy.size.x - grid * 2;
				const sprayCount = 32;
				for(i = 0; i < sprayCount; i++){
					if(i < sprayCount / 2 + 1) bulletsEnemies.spawn('lyricaSprayRed', enemy);
					enemy.spray.angle += Math.PI / sprayCount * 2;
				}
				spawnSound.bulletTwo()
				enemy.spray.index = 0;
			},
			sprayTwo(){
				enemy.spray.position.x = enemy.direction ? grid * 2 : gameWidth - enemy.size.x - grid * 2;
				const sprayCount = 32;
				for(i = 0; i < sprayCount; i++){
					bulletsEnemies.spawn('lyricaSprayBlue', enemy);
					enemy.spray.angle += Math.PI / sprayCount * 2;
				}
				spawnSound.bulletThree()
				enemy.spray.index++;
			},
			sprayBig(){
				const sprayInterval = 40;
				enemy.spray.position.x = enemy.direction ? grid * 2 : gameWidth - enemy.size.x - grid * 2;
				if(enemy.clock % sprayInterval == 0){
					const sprayCount = 36;
					for(i = 0; i < sprayCount; i++){
						bulletsEnemies.spawn('lyricaSprayBigRed', enemy);
						enemy.spray.angle += Math.PI / sprayCount * 2;
					}
					spawnSound.bulletOne()
				} else if(enemy.clock % sprayInterval == sprayInterval / 2){
					const sprayCount = 36;
					for(i = 0; i < sprayCount; i++){
						bulletsEnemies.spawn('lyricaSprayBigBlue', enemy);
						enemy.spray.angle -= Math.PI / sprayCount * 2;
					}
					spawnSound.bulletTwo()
				}
			}
		};
		if(enemy.startSpeed > 0){
			enemy.position.y += enemy.startSpeed;
			enemy.startSpeed -= enemy.startSpeedDiff;
		} else {
			checkMove();
			const sprayInterval = 15;

			if(enemy.clock < sprayInterval * 15 && enemy.clock % sprayInterval == 0) spawns.spray();

			else if(enemy.clock >= enemy.waveInterval && enemy.clock < enemy.waveInterval + sprayInterval * 15 &&
				enemy.clock % sprayInterval == 0) spawns.sprayTwo();

			else if(enemy.clock >= enemy.waveInterval * 2 &&
				enemy.clock < enemy.waveInterval * 2 + sprayInterval * 15) spawns.sprayBig();

			else if(enemy.clock >= enemy.waveInterval * 3 &&
				enemy.clock < enemy.waveInterval * 3 + sprayInterval * 15 && enemy.clock % sprayInterval == 0) spawns.spray();

			else if(enemy.clock >= enemy.waveInterval * 4){
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

enemies.waves.lyrica = () => {
	enemies.spawn(enemies.data.lyrica());
	currentWave = 'five';
};