enemies.data.merlin = () => {
	const id = randomId();
	const enemyObj = {
		id: id,
		health: 600,
		size: {x: 30, y: 62},
		frames: true,
		moving: {left: false, right: true},
		image: img.merlin,
		waveStarted: false,
		speed: 1.25,
		startSpeed: 4.85,
		startSpeedDiff: 0.125,
		waveInterval: 60 * 10,
		clock: 0,
		bobInterval: 90,
		spray: {
			angle: 0,
			interval: 15,
			limit: 8
		},
		tri: {
			angle: 0,
			interval: 15,
			limit: 8
		},
		homing: {},
		score: 60000
	};
	enemyObj.position = {x: gameWidth / 2 - enemyObj.size.x, y: -enemyObj.size.y};
	bossData = {
		name: 'merlin',
		life: enemyObj.health,
		lifeMax: enemyObj.health
	};
	enemyObj.update = () => {
		const enemy = enemies.dump[id], spawns = {
			sprayBlue(){
				const sprayInterval = 30;
				enemy.spray.position = {x: player.data.position.x + player.data.size.x / 2, y: player.data.position.y + player.data.size.y / 2}
				if(enemy.clock % sprayInterval == 0){
					const sprayCount = 40;
					for(i = 0; i < sprayCount; i++){
						if(i % enemy.spray.limit < enemy.spray.limit - enemy.spray.limit / 2) bulletsEnemies.spawn('merlinSpray', enemy);
						enemy.spray.angle += Math.PI / sprayCount * 2;
					}
					spawnSound.bulletThree()
					enemy.spray.angle += 0.2;
				}
			},
			homing(){
				const interval = 60;
				if(enemy.clock % interval == 0){
					enemy.homing.position = {x: Math.floor(Math.random() * gameWidth), y: -16};
					bulletsEnemies.spawn('merlinHoming', enemy);
					spawnSound.bulletThree()
				}
			},
			sprayTri(){
				const sprayInterval = 15, sprayLimit = 6
				if(enemy.clock % sprayInterval == 0){
					const sprayCount = 16;
					for(i = 0; i < sprayCount; i++){
						if(i % sprayLimit < sprayLimit - sprayLimit / 2) bulletsEnemies.spawn('merlinTri', enemy);
						enemy.tri.angle += Math.PI / sprayCount * 2;
					}
					enemy.tri.angle -= 0.1;
					spawnSound.bulletOne();
				}
			},
			sprayRed(){
				const sprayInterval = 30;
				if(enemy.clock % sprayInterval == 0){
					const sprayCount = 20;
					for(i = 0; i < sprayCount; i++){
						bulletsEnemies.spawn('merlinSprayRed', enemy);
						enemy.spray.angle += Math.PI / sprayCount * 2;
					}
					enemy.spray.angle -= 0.1;
					spawnSound.bulletTwo();
				}
			}
		}
		if(enemy.startSpeed > 0){
			enemy.position.y += enemy.startSpeed;
			enemy.startSpeed -= enemy.startSpeedDiff;
		} else {
			if(enemy.clock % enemy.waveInterval < enemy.waveInterval / 2){
				spawns.sprayBlue();
				spawns.homing();
			} else {
				spawns.sprayTri();
				spawns.sprayRed();
			}
			if(enemy.clock % enemy.bobInterval == 0) enemy.position.y++;
			else if(enemy.clock % enemy.bobInterval == enemy.bobInterval / 2) enemy.position.y--;
			enemy.clock++;
			if(enemy.health <= 1){
				enemy.health = 0;
				bossData = false;
				finishedGame = true;
				gameOver = true;
				currentWave = false;
			}
		}
	};
	return enemyObj;
};

enemies.waves.merlin = () => {
	enemies.spawn(enemies.data.merlin());
};