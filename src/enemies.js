let currentWave = 'one';

const enemies = {

	dump: {},

	data: {

		one(pos){
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
		},

		two(isRight){
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
		},

		three(index){
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
		},

		four(isRight){
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
		},

		five(pos){
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
		},

		six(pos){
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
		},

		lunasa(){
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
		},

		lyrica(){
			const id = randomId();
			const enemyObj = {
				id: id,
				health: 250,
				size: {x: 32, y: 60},
				frames: true,
				moving: {left: false, right: true},
				direction: 0,
				image: img.lyrica,
				waveStarted: false,
				speed: 1.25,
				startSpeed: 2.6,
				waveInterval: 60 * 4.25,
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
						const sprayInterval = 10;
						enemy.spray.position.x = enemy.direction ? grid * 2 : gameWidth - enemy.size.x - grid * 2;
						if(enemy.clock % enemy.waveInterval < enemy.waveInterval * .33 && enemy.clock % sprayInterval == 0){
							const sprayCount = 24;
							for(i = 0; i < sprayCount; i++){
								if(i < sprayCount / 2 + 1) bulletsEnemies.spawn('lyricaSprayRed', enemy);
								enemy.spray.angle += Math.PI / sprayCount * 2;
							}
							spawnSound.bulletTwo()
							enemy.spray.index = 0;
						} else if(enemy.clock % enemy.waveInterval >= enemy.waveInterval * .5 &&
							enemy.clock % enemy.waveInterval <= enemy.waveInterval * .75 &&
							enemy.clock % enemy.spray.interval == 0){
							const sprayCount = 32;
							for(i = 0; i < sprayCount; i++){
								// enemy.spray.index = i;
								bulletsEnemies.spawn('lyricaSprayBlue', enemy);
								enemy.spray.angle += Math.PI / sprayCount * 2;
							}
							spawnSound.bulletThree()
							enemy.spray.index++;
						}
					},
					sprayBig(){
						const sprayInterval = 40;
						enemy.spray.position = {x: player.data.position.x + player.data.size.x / 2, y: player.data.position.y + player.data.size.y / 2}
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
					enemy.startSpeed -= 0.03;
				} else {
					checkMove();
					const waveLimit = 2;
					if(enemy.clock < enemy.waveInterval * waveLimit) spawns.spray();
					if(enemy.clock >= enemy.waveInterval * waveLimit && enemy.clock < enemy.waveInterval * (waveLimit * 2) && !enemy.moving.left && !enemy.moving.right) spawns.sprayBig();
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
		},

		merlin(){
			const id = randomId();
			const enemyObj = {
				id: id,
				health: 360,
				size: {x: 30, y: 62},
				frames: true,
				moving: {left: false, right: true},
				image: img.merlin,
				waveStarted: false,
				speed: 1.25,
				startSpeed: 2.6,
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
						const sprayInterval = 25;
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
						const interval = 20;
						if(enemy.clock % interval == 0){
							enemy.homing.position = {x: Math.floor(Math.random() * gameWidth), y: -16};
							bulletsEnemies.spawn('merlinHoming', enemy);
							spawnSound.bulletThree()
						}
					},
					sprayTri(){
						const sprayInterval = 15, sprayLimit = 6
						if(enemy.clock % sprayInterval == 0){
							const sprayCount = 18;
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
							const sprayCount = 24;
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
					enemy.startSpeed -= 0.0325;
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
					if(enemy.health <= 0){
						finishedGame = true;
						gameOver = true;
						currentWave = false;
					}
				}
			};
			return enemyObj;
		}

	},

	waves: {

		one(){
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
		},

		two(){
			const timeout = 350;
			enemies.spawn(enemies.data.two());
			setTimeout(() => {
				enemies.spawn(enemies.data.two(true));
				currentWave = 'lunasa';
			}, timeout);
		},

		three(){
			bulletsEnemies.dump = {};
			bossData = false;
			for(i = 0; i < 5; i++) enemies.spawn(enemies.data.three(i));
			currentWave = 'four';
		},

		four(){
			enemies.spawn(enemies.data.four());
			const timeout = 1000;
			setTimeout(() => {
				enemies.spawn(enemies.data.four(true));
				currentWave = 'lyrica';
			}, timeout);
		},

		five(){
			bulletsEnemies.dump = {};
			bossData = false;
			const timeout = 350;
			enemies.spawn(enemies.data.five(grid * 2));
			setTimeout(() => {
				enemies.spawn(enemies.data.five(gameWidth - grid * 2 - 22));
				currentWave = 'six';
			}, timeout);
		},

		six(){
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
		},

		lunasa(){
			enemies.spawn(enemies.data.lunasa());
			currentWave = 'three';
		},

		lyrica(){
			enemies.spawn(enemies.data.lyrica());
			currentWave = 'five';
		},

		merlin(){
			enemies.spawn(enemies.data.merlin());
		}

	},

	spawn(enemy){
		enemies.dump[enemy.id] = enemy;
	},

	update(){
		if(Object.keys(enemies.dump).length){
			for(id in enemies.dump){
				const enemy = enemies.dump[id];
				enemy.update();
				if(enemy.position.y + enemy.size.y < -enemy.size.y || enemy.position.y > gameHeight ||
					enemy.position.x + enemy.size.x < -enemy.size.x || enemy.position.x > gameWidth) delete enemies.dump[id];
				if(enemy.health < 1){
					currentScore += enemy.score;
					drop.spawn(enemy);
					delete enemies.dump[id];
				}
			}
		} else if(currentWave) enemies.waves[currentWave]();
	},

	draw(){
		if(Object.keys(enemies.dump).length){
			for(id in enemies.dump){
				const enemy = enemies.dump[id];
				if(enemy.frames){
					let xOffset = 0;
					if(enemy.moving && (enemy.moving.left)) xOffset = enemy.size.x;
					else if(enemy.moving && (enemy.moving.right)) xOffset = enemy.size.x * 2;
					context.drawImage(enemy.image, xOffset, 0, enemy.size.x, enemy.size.y, enemy.position.x, enemy.position.y, enemy.size.x, enemy.size.y);
				} else drawImg(enemy.image, enemy.position.x, enemy.position.y, enemy.size.x, enemy.size.y);
			}
		}
	}

};