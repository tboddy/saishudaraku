const collisions = {

	dump: [],
	size: 32,
	playerPartitions: [],
	playerShotPartitions: [],
	dropPartitions: [],
	shotPartitions: [],

	get(section, element, arr, isDrop){
		let leftX = element.x - collisions.size, rightX = element.x + element.width,
			topY = element.y - collisions.size, bottomY = element.y + element.height;
		if(isDrop){
			const sizeMod = 128;
			leftX -= sizeMod;
			rightX += sizeMod;
			topY -= sizeMod;
			bottomY += sizeMod;
		}
		if(section.x >= leftX && section.x <= rightX	&& section.y >= topY && section.y <= bottomY && arr.indexOf(section.id) == -1)
			arr.push(section.id);
	},

	boundingBox(){
		return  {
			x: player.data.position.x + player.data.size.x / 2 - 3 + 2,
			y: player.data.position.y + 12 + 2,
			width: 2,
			height: 2
		}
	},

	playerObj(){ return {x: player.data.position.x, y: player.data.position.y, width: player.data.size.x, height: player.data.size.y};
	},

	setup(){
		const partitionCount = {x: 15, y: 20};
		let partitionIndex = 0;
		for(var i = 0; i < partitionCount.y; i++){
			for(var j = 0; j < partitionCount.x; j++){
				collisions.dump.push({
					x: j * collisions.size,
					y: i * collisions.size,
					id: partitionIndex
				});
				partitionIndex++;
			}
		}
	},

	check(parts, element, callback){
		const partitionsArray = [];
		let found = false;
		parts.forEach(index => {
			partitionsArray.push(collisions.dump[index]);
		});
		partitionsArray.forEach(section => {
			if(element.x >= section.x && element.x <= section.x + collisions.size &&
				element.y >= section.y && element.y <= section.y + collisions.size) found = true;
		});
		if(found) callback();
	},

	update(){
		collisions.playerPartitions = [];
		collisions.playerShotPartitions = [];
		collisions.dropPartitions = [];
		collisions.shotPartitions = [];

		collisions.dump.forEach(section => {
			collisions.get(section, collisions.playerObj(), collisions.playerPartitions); // getting player
			if(Object.keys(bulletsPlayer.dump).length){
				for(id in bulletsPlayer.dump){
					const bullet = bulletsPlayer.dump[id];
					const shotObj = {x: bullet.position.x, y: bullet.position.y, width: bullet.size.x, height: bullet.size.y};
					collisions.get(section, shotObj, collisions.playerShotPartitions);
				}
			}
			if(Object.keys(drop.dump).length){
				for(id in drop.dump){
					const dropItem = drop.dump[id];
					const dropObj = {x: dropItem.position.x, y: dropItem.position.y, width: dropItem.size.x, height: dropItem.size.y};
					collisions.get(section, dropObj, collisions.dropPartitions, true);
				}
			}
		});

		const checkBulletsWithPlayer = () => {
			let hitPlayer = false;
			for(id in bulletsEnemies.dump){
				bullet = bulletsEnemies.dump[id];
				const bulletObj = {
					x: bullet.position.x + 2,
					y: bullet.position.y + 2,
					width: bullet.size.x - 4,
					height: bullet.size.x - 4
				}, playerCollision = () => {
					checkCollision(collisions.boundingBox(), bulletObj, () => {
						hitPlayer = true;
						explosions.spawn(bulletObj);
					});
				}
				if(!bullet.grazed){
					checkCollision(collisions.playerObj(), bulletObj, () => {
						if(!bullet.grazed){
							bullet.grazed = true;
							currentScore += grazeScore;
							spawnSound.graze();
							pointChrome.spawn(bullet, grazeScore);
						}
						playerCollision();
					});
				} else playerCollision();
			};
			if(hitPlayer){
				player.data.position = {x: gameWidth / 2 - 28 / 2, y: gameHeight - 42 - grid};
				player.data.powerLevel -= 25;
				if(player.data.powerLevel < 0) player.data.powerLevel = 0;
				bulletsEnemies.dump = {};
				player.data.lives -= 1;
				if(!player.data.lives) gameOver = true;
			}
		},

		checkBulletsWithEnemies = () => {
			for(id in enemies.dump){
				enemy = enemies.dump[id];
				const enemyObj = {x: enemy.position.x, y: enemy.position.y, width: enemy.size.x, height: enemy.size.y};
				collisions.check(collisions.playerShotPartitions, enemyObj, () => {
					for(shotId in bulletsPlayer.dump){
						const shot = bulletsPlayer.dump[shotId];
						const shotObj = {x: shot.position.x, y: shot.position.y, width: shot.size.x, height: shot.size.y};
						checkCollision(shotObj, enemyObj, () => {
							enemy.health -= 1;
							if(bossData) bossData.life -=1;
							delete bulletsPlayer.dump[shotId];
							explosions.spawn(shotObj);
						});
					}
				});
			}
		},

		checkFocusWithEnemies = () => {
			const healthMultiplier = .75;
			for(id in enemies.dump){
				enemy = enemies.dump[id];
				if(enemy.position.x + enemy.size.x >= player.data.focusData.x &&
					enemy.position.x <= player.data.focusData.x + player.data.focusData.width){
					enemy.health -= 1 * healthMultiplier;
					if(bossData) bossData.life -= 1 * healthMultiplier;
					const enemyObj = {x: enemy.position.x, y: enemy.position.y, width: enemy.size.x, height: enemy.size.y};
					const focusObj = {x: player.data.focusData.x, y: enemyObj.y, width: player.data.focusData.width, height: enemyObj.height};
					explosions.spawn(focusObj);
					player.data.focusColliding = true;
				} else if(player.data.focusColliding) player.data.focusColliding = false;

			}
		},

		getDrops = () => {
			const playerObj = {x: player.data.position.x, y: player.data.position.y, width: player.data.size.x, height: player.data.size.y};
			pullDrop = dropItem => {
				dropItem.pullAngle = getAngle(dropItem, player.data);
				dropItem.speed.x = dropItem.pullSpeed * -Math.cos(dropItem.pullAngle);
				dropItem.speed.y = dropItem.pullSpeed * -Math.sin(dropItem.pullAngle);
				dropItem.pullSpeed += dropItem.pullSpeedDiff;
				const dropObj = {x: dropItem.position.x, y: dropItem.position.y, width: dropItem.size.x, height: dropItem.size.y};
				checkCollision(dropObj, playerObj, () => {
					if(dropItem.value){
						currentScore += dropItem.value;
						pointChrome.spawn(dropItem, dropItem.value)
					}
					else if(player.data.powerLevel < 100){
						player.data.powerLevel += player.data.powerDiff;
						if(player.data.powerLevel > 100) player.data.powerLevel = 100;
					}
					delete drop.dump[id];
				});
			};
			if(collisions.boundingBox().y <= gameHeight / 4) for(id in drop.dump) pullDrop(drop.dump[id]);
			else {
				collisions.check(collisions.dropPartitions, playerObj, () => {
					for(id in drop.dump){
						const dropItem = drop.dump[id];
						const pullObj = {
							x: dropItem.position.x + dropItem.size.x / 4,
							y: dropItem.position.y + dropItem.size.y / 4,
							width: dropItem.size.x * 4,
							height: dropItem.size.y * 4
						};
						checkCollision(pullObj, playerObj, () => {
							pullDrop(dropItem)
						});
					}
				});
			}
		};

		if(!gameOver){
			if(Object.keys(bulletsEnemies.dump).length) checkBulletsWithPlayer();
			if(Object.keys(enemies.dump).length && Object.keys(bulletsPlayer.dump).length) checkBulletsWithEnemies();
			if(Object.keys(drop.dump).length) getDrops();
			if(player.data.focus && player.data.shooting) checkFocusWithEnemies();
		}
	},

	draw(){
		collisions.dump.forEach(section => {
			const drawBorders = () => {
				drawRect(section.x, section.y, 1, collisions.size, 'green');
				drawRect(section.x, section.y + collisions.size, collisions.size, 1, 'green');
			}, drawPlayer = () => {
				if(collisions.playerPartitions.indexOf(section.id) > -1) drawRect(section.x, section.y, collisions.size, collisions.size, colors.red);
			}, drawPlayerShots = () => {
				if(collisions.playerShotPartitions.indexOf(section.id) > -1) drawRect(section.x, section.y, collisions.size, collisions.size, colors.red);
			}, drawShots = () => {
				if(collisions.playerShotPartitions.indexOf(section.id) > -1) drawRect(section.x, section.y, collisions.size, collisions.size, colors.red);
			};
			context.save();
			context.globalAlpha = 0.5;
			drawBorders();
			context.globalAlpha = 0.25;
			drawPlayer();
			drawPlayerShots();
			context.restore();
		});
	}

};




