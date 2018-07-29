let modifiedAngle = 0

const bulletsEnemies = {

	dump: {},

	data: {

		enemyOne(enemy){
			let angle = getAngle(enemy.destination, enemy);
			const id = randomId(), speed = 2, angleModifier = 0.2;
			angle = angle + modifiedAngle - angleModifier * 2;
			modifiedAngle += angleModifier;
			return {
				id: id,
				image: img.bulletRed,
				size: {x: 10, y: 10},
				position: {x: enemy.position.x + enemy.size.x / 2 - 10, y: enemy.position.y + enemy.size.y / 2 + 10},
				speed: {x: speed * Math.cos(angle), y: speed * Math.sin(angle)},
				update(){
					const bullet = bulletsEnemies.dump[id];
					bullet.position.x += bullet.speed.x;
					bullet.position.y += bullet.speed.y;
				}
			}
		},

		enemyTwoSpray(enemy){
			const id = randomId(), angleDiff = .02, bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletRed,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: enemy.position.x + enemy.size.x / 2 - bulletSize / 2,
					y: enemy.position.y + enemy.size.y / 2 + bulletSize / 2
				},
				angle: enemy.sprayAngle,
				speed: 1.5,
				clock: 0
			}
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				bullet.clock++;
			}
			return bulletObj;
		},

		enemyTwoHoming(enemy){
			const id = randomId(), bulletSize = 16;
			const bulletObj = {
				id: id,
				image: img.bulletBlueBig,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: enemy.position.x + enemy.size.x / 2 - bulletSize / 2,
					y: enemy.position.y + enemy.size.y / 2 + bulletSize / 2
				},
				speedMod: 2,
				clock: 0
			};
			const homingAngle = getAngle(bulletObj, player.data);
			bulletObj.speed = { x: bulletObj.speedMod * Math.cos(homingAngle), y: bulletObj.speedMod * Math.sin(homingAngle)};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x -= bullet.speed.x;
				bullet.position.y -= bullet.speed.y;
				bullet.clock++;
			}
			return bulletObj;
		},

		enemyThree(enemy){
			const id = randomId(), angleDiff = .02, bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: enemy.position.x + enemy.size.x / 2 - bulletSize / 2,
					y: enemy.position.y + enemy.size.y / 2 + bulletSize / 2
				},
				angle: enemy.sprayAngle,
				speed: 1.75,
				clock: 0
			}
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				bullet.clock++;
			}
			return bulletObj;
		},

		enemyFour(enemy, opts){
			const id = randomId(), bulletSize = 16;
			const bulletObj = {
				id: id,
				image: img.bulletRedBig,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: enemy.position.x + enemy.size.x / 2 - bulletSize / 2,
					y: enemy.position.y + enemy.size.y / 2 + bulletSize / 2
				},
				speedMod: 1.25,
				clock: 0
			}
			let angle = getAngle(bulletObj, {size: {x: 2, y: 2}, position: enemy.initPosition});
			const sideMod = 1;
			if(opts && (opts.left)){
				angle += enemy.direction ? -sideMod : sideMod;
			} else if(opts && (opts.right)){
				angle += enemy.direction ? sideMod : -sideMod;
			}
			bulletObj.speed = {
				x: bulletObj.speedMod * Math.cos(angle),
				y: bulletObj.speedMod * -Math.sin(angle)
			}
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x -= bullet.speed.x;
				bullet.position.y += bullet.speed.y;
				bullet.clock++;
			}
			return bulletObj;
		},

		enemyFive(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: enemy.position.x > gameWidth / 2 ? img.bulletRed : img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: enemy.position.x + enemy.size.x / 2 - bulletSize / 2,
					y: enemy.position.y + enemy.size.y / 2 + bulletSize / 2
				},
				angle: enemy.sprayAngle,
				speed: 1.75
			}
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
			}
			return bulletObj;
		},

		enemySix(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: enemy.isRed ? img.bulletRed : img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: enemy.position.x + enemy.size.x / 2 - bulletSize / 2,
					y: enemy.position.y + enemy.size.y / 2 + bulletSize / 2
				},
				angle: enemy.sprayAngle,
				speed: 1.75,
				angleDiff: -0.0075
			};

			// console.log(enemy.position.x > gameWidth / 2)

			if(enemy.position.x > gameWidth / 2) bulletObj.angleDiff = -bulletObj.angleDiff;

			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				bullet.angle += bullet.angleDiff
			}
			return bulletObj;
		},

		lunasaSpine(enemy, opts){
			const id = randomId();
			const bulletObj = {
				id: id,
				image: img.bulletBlue,
				size: {x: 10, y: 10},
				speedMod: 2.5
			};
			bulletObj.position = {
				x: enemy.spine.position.x + enemy.spine.size.x / 2 - bulletObj.size.x / 2,
				y: enemy.spine.position.y + enemy.spine.size.y / 2 + bulletObj.size.y / 2
			};
			let angle = getAngle(bulletObj, {size: enemy.spine.size, position: enemy.spine.initPosition});
			const sideMod = 0.5;
			if(opts && (opts.left)){
				angle += enemy.direction ? -sideMod : sideMod;
			} else if(opts && (opts.right)){
				angle += enemy.direction ? sideMod : -sideMod;
			}
			bulletObj.speed = {
				x: bulletObj.speedMod * Math.cos(angle),
				y: bulletObj.speedMod * -Math.sin(angle)
			}
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x -= bullet.speed.x;
				bullet.position.y += bullet.speed.y;
				bullet.clock++;
			}
			return bulletObj;
		},

		lunasaSecondSpine(enemy){
			const id = randomId();
			const bulletObj = {
				id: id,
				image: img.bulletRedBig,
				size: {x: 16, y: 16},
				speed: {x: 1, y: 1},
				speedMod: 0,
				speedStep: 0.02,
				hasVisibility: true,
				visible: false,
				visibleTime: 60 * 1.5,
				moveTime: 60 * 2.5,
				clock: 0
			};
			bulletObj.position = {
				x: enemy.spine.position.x + enemy.spine.size.x / 2 - bulletObj.size.x / 2,
				y: enemy.spine.position.y + enemy.spine.size.y / 2 + bulletObj.size.y / 2
			};

			const getSpeed = () => {
				let num = (Math.random() * 4) - 2;
				const doGetSpeed = () => {
					if(num > -1 && num < 1){
						num = (Math.random() * 4) - 2;
						return doGetSpeed();
					} else {
						return num;
					}
				}
				num = doGetSpeed();
				return num;
			}

			const randomDestination = {
				size: {x: 2, y: 2},
				position: {x: Math.random() * gameWidth, y: Math.random() * gameHeight}
			};
			const angle = getAngle(bulletObj, randomDestination)
			bulletObj.speed.x = Math.cos(angle);
			bulletObj.speed.y = Math.sin(angle);

			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				if(bullet.clock >= bullet.visibleTime){
					if(!bullet.visible) bullet.visible = true;
					bullet.position.y += bullet.speedMod * bullet.speed.y;
					bullet.position.x -= bullet.speedMod * bullet.speed.x;
					bullet.position.x = bullet.position.x;
					bullet.position.y = bullet.position.y;
					if(bullet.clock >= bullet.moveTime) bullet.speedMod += bullet.speedStep;
				}
				bullet.clock++;
			}
			return bulletObj;
		},

		lunasaSpray(enemy){
			const id = randomId(), angleDiff = .015, bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: enemy.spray.position.x + enemy.size.x / 2 - bulletSize / 2,
					y: enemy.spray.position.y + enemy.size.y / 2 + bulletSize / 2
				},
				angle: enemy.spray.angle,
				speed: 4,
				speedDiff: .1,
				clock: 0,
				speedLimit: -2.6,
				angleDiff: enemy.direction ? angleDiff : -angleDiff
			}
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				bullet.angle += bullet.angleDiff;
				if(bullet.speed > bullet.speedLimit) bullet.speed -= bullet.speedDiff;
				bullet.clock++;
			}
			return bulletObj;
		},

		lunasaHoming(enemy){
			const id = randomId(), angleDiff = .02, bulletSize = 16;
			const bulletObj = {
				id: id,
				image: img.bulletRedBig,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: enemy.spray.position.x + enemy.size.x / 2 - bulletSize / 2,
					y: enemy.spray.position.y + enemy.size.y / 2 + bulletSize / 2
				},
				speedMod: 2,
				clock: 0
			};
			if(enemy.clock % enemy.waveInterval == 0){
				enemy.homingAngle = getAngle(bulletObj, player.data);
			}
			bulletObj.speed = { x: bulletObj.speedMod * Math.cos(enemy.homingAngle), y: bulletObj.speedMod * Math.sin(enemy.homingAngle)};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x -= bullet.speed.x;
				bullet.position.y -= bullet.speed.y;
				bullet.clock++;
			}
			return bulletObj;
		},

		lyricaSprayRed(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletRed,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: enemy.spray.position.x + enemy.size.x / 2 - bulletSize / 2,
					y: enemy.spray.position.y + enemy.size.y / 2 - bulletSize / 2
				},
				angle: enemy.spray.angle,
				speedInit: 2.5,
				speedSecond: 2,
				speedDiff: .04,
				finished: false,
				clock: 0
			}
			bulletObj.speed = {x: bulletObj.speedInit, y: bulletObj.speedInit};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed.x * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed.y * Math.sin(bullet.angle);
				if(bullet.speed.x > -1 && !bullet.finished){
					bullet.speed.x -= bullet.speedDiff;
					bullet.speed.y -= bullet.speedDiff;
				} else if(bullet.speed.x <= -.75 && !bullet.finished){
					bullet.finished = true;
					bullet.angle = getAngle(bullet, {
						size: {x: 2, y: 2},
						position: {x: Math.floor(Math.random() * gameWidth), y: Math.floor(Math.random() * gameHeight)}
					});
					bullet.speed.x = bullet.speedSecond;
					bullet.speed.y = bullet.speedSecond;
				}
				bullet.clock++;
			}
			return bulletObj;
		},

		lyricaSprayBlue(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: enemy.spray.position.x + enemy.size.x / 2 - bulletSize / 2,
					y: enemy.spray.position.y + enemy.size.y / 2 - bulletSize / 2
				},
				angle: enemy.spray.angle,
				speed: 3,
				finished: false,
				speedMod: 0.02
			};
			if(enemy.spray.index % 2 == 0) enemy.spray.angle += Math.PI / 16
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				if(bullet.speed > 1) bullet.speed -= bullet.speedMod;
			}
			return bulletObj;
		},

		lyricaSprayBigRed(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletRed,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: enemy.spray.position.x + enemy.size.x / 2 - bulletSize / 2,
					y: enemy.spray.position.y + enemy.size.y / 2 - bulletSize / 2
				},
				angle: enemy.spray.angle,
				speed: 0.75,
				finished: false,
				speedMod: 0.007,
				angleDiff: 0.004
			};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				bullet.angle += bullet.angleDiff;
				bullet.speed += bullet.speedMod;
			}
			return bulletObj;
		},

		lyricaSprayBigBlue(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: enemy.spray.position.x + enemy.size.x / 2 - bulletSize / 2,
					y: enemy.spray.position.y + enemy.size.y / 2 - bulletSize / 2
				},
				angle: enemy.spray.angle,
				speed: 0.75,
				speedMod: 0.007,
				angleDiff: 0.004
			};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				bullet.angle -= bullet.angleDiff;
				bullet.speed += bullet.speedMod;
			}
			return bulletObj;
		},

		merlinSpray(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: enemy.position.x + enemy.size.x / 2 - bulletSize / 2,
					y: enemy.position.y + enemy.size.y / 2 + bulletSize / 2
				},
				angle: enemy.spray.angle,
				speed: 1.25,
				angleDiff: 0.0035,
				speedDiff: 0.0008
			};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				bullet.angle -= bullet.angleDiff;
				bullet.speed += bullet.speedDiff;
			}
			return bulletObj;
		},

		merlinHoming(enemy){
			const id = randomId(), bulletSize = 16;
			const bulletObj = {
				id: id,
				image: img.bulletRedBig,
				size: {x: bulletSize, y: bulletSize},
				position: enemy.homing.position,
				speed: 1.5,
				angleDiff: 0.004,
				speedDiff: 0.0008
			};
			bulletObj.angle = getAngle(bulletObj, player.data);
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x -= bullet.speed * Math.cos(bullet.angle);
				bullet.position.y -= bullet.speed * Math.sin(bullet.angle);
			}
			return bulletObj;
		},

		merlinTri(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletRed,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: enemy.position.x + enemy.size.x / 2 - bulletSize / 2,
					y: enemy.position.y + enemy.size.y / 2 + bulletSize / 2
				},
				angle: enemy.tri.angle,
				speed: 1.25,
				finished: false,
				angleDiff: 0.004,
				speedDiff: 0.0008
			};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
				if(bullet.speed > .99){
					if(!bullet.finished){
						bullet.finished = true;
						bullet.angle = getAngle(bullet, {
							position: {x: Math.floor(Math.random() * gameWidth), y: Math.floor(Math.random() * gameHeight)},
							size: {x: 2, y: 2}
						});
					}
				} else {
					bullet.angle -= bullet.angleDiff;
					bullet.speed += bullet.speedDiff;
				}
			}
			return bulletObj;
		},

		merlinSprayRed(enemy){
			const id = randomId(), bulletSize = 10;
			const bulletObj = {
				id: id,
				image: img.bulletBlue,
				size: {x: bulletSize, y: bulletSize},
				position: {
					x: enemy.position.x + enemy.size.x / 2 - bulletSize / 2,
					y: enemy.position.y + enemy.size.y / 2 + bulletSize / 2
				},
				angle: enemy.spray.angle,
				speed: 1.5
			};
			bulletObj.update = () => {
				const bullet = bulletsEnemies.dump[id];
				bullet.position.x += bullet.speed * Math.cos(bullet.angle);
				bullet.position.y += bullet.speed * Math.sin(bullet.angle);
			}
			return bulletObj;
		}

	},

	spawn(type, enemy, opts){
		opts = opts ? opts : false;
		const bullet = bulletsEnemies.data[type](enemy, opts);
		if(!bulletsEnemies.dump[bullet.id]) bulletsEnemies.dump[bullet.id] = bullet;
	},

	update(){
		if(Object.keys(bulletsEnemies.dump).length){
			for(id in bulletsEnemies.dump){
				const bullet = bulletsEnemies.dump[id];
				bullet.update();
				if(bullet.position.y + bullet.size.y < -gameHeight / 6 || bullet.position.y > gameHeight + gameHeight / 6 ||
					bullet.position.x + bullet.size.x < -gameWidth / 6 || bullet.position.x > gameWidth + gameWidth / 6) delete bulletsEnemies.dump[id];
			}
		}
	},

	draw(){
		if(Object.keys(bulletsEnemies.dump).length){
			for(id in bulletsEnemies.dump){
				const bullet = bulletsEnemies.dump[id];
				if(!bullet.hasVisibility || (bullet.hasVisibility && (bullet.visible)))
					drawImg(bullet.image, bullet.position.x, bullet.position.y, bullet.size.x, bullet.size.y);
			}
		}
	}

};