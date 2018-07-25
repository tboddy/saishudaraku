enemies.data.lunasa = () => {
	const id = randomId();
	const enemyObj = {
		id: id,
		health: 220,
		size: {x: 26, y: 60},
		frames: true,
		moving: {left: false, right: true},
		direction: 0,
		image: img.lunasa,
		waveStarted: false,
		speed: 1.25,
		waveInterval: 60 * 4.4,
		startSpeed: 2.6,
		clock: 0,
		bobInterval: 90,
		spine: {
			size: {x: 2, y: 2},
			shotInterval: 10,
			secondShotInterval: 2,
			speedMod: 2.5
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
			enemy.startSpeed -= 0.03;
		} else {
			enemy.spray.position.y = enemy.position.y;
			checkMove();
			const waveLimit = 2;
			if(enemy.clock < enemy.waveInterval * waveLimit) spawns.spine();
			else if(enemy.clock >= enemy.waveInterval * waveLimit && enemy.clock < enemy.waveInterval * (waveLimit * 2)) spawns.spray();
			else if(enemy.clock >= enemy.waveInterval * (waveLimit * 2)){
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

enemies.waves.lunasa = () => {
	enemies.spawn(enemies.data.lunasa());
	currentWave = 'three';
};