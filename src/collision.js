const collisions = {

	dump: [],
	size: 16,
	playerPartitions: [],
	playerShotPartitions: [],
	dropPartitions: [],

	get(section, element, arr){
		if(section.x >= element.x - collisions.size &&
			section.x <= element.x + element.width &&
			section.y >= element.y - collisions.size &&
			section.y <= element.y + element.height){
			if(arr.indexOf(section.id) == -1) arr.push(section.id);
		}
	},

	boundingBox(){
		return  {
			x: player.data.position.x + player.data.size.x / 2 - 3 + 2,
			y: player.data.position.y + 12 + 2,
			width: 2,
			height: 2
		}
	},

	playerObj(){
		return {x: player.data.position.x, y: player.data.position.y, width: player.data.size.x, height: player.data.size.y};
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
					collisions.get(section, dropObj, collisions.dropPartitions);
				}
			}
		});

		const checkBulletsWithPlayer = () => {
			let hitPlayer = false, hitGraze = false;
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
						explosions.spawn(bulletObj, {x: player.data.position.x, y: player.data.position.y, height: player.data.size.y, width: player.data.size.x});
					});
				}
				if(!bullet.grazed){
					checkCollision(collisions.playerObj(), bulletObj, () => {
						bullet.grazed = true;
						hitGraze = true;
						playerCollision();
					});
				} else playerCollision();
			};
			if(hitGraze){
				currentScore += 150;
				spawnSound.graze();
			}
			if(hitPlayer){
				player.data.position = {x: gameWidth / 2 - 28 / 2, y: gameHeight - 42 - grid},
				player.data.powerLevel = 1;
				player.data.powerClock = 0;
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
							explosions.spawn(shotObj, enemyObj);
						});
					}
				});
			}
		},

		getDrops = () => {
			const playerObj = {x: player.data.position.x, y: player.data.position.y, width: player.data.size.x, height: player.data.size.y};
			collisions.check(collisions.dropPartitions, playerObj, () => {
				for(id in drop.dump){
					const dropItem = drop.dump[id];
					const dropObj = {x: dropItem.position.x, y: dropItem.position.y, width: dropItem.size.x, height: dropItem.size.y};
					checkCollision(dropObj, playerObj, () => {
						caughtDrop = true;
						delete drop.dump[id];
						player.data.powerLevel = 5;
						player.data.powerClock = player.data.powerLevel * player.data.powerInterval;
					});
				}
			});
		};

		if(!gameOver){
			if(Object.keys(bulletsEnemies.dump).length) checkBulletsWithPlayer();
			if(Object.keys(enemies.dump).length && Object.keys(bulletsPlayer.dump).length) checkBulletsWithEnemies();
			if(Object.keys(drop.dump).length) getDrops();
		}
	},

	draw(){
		collisions.dump.forEach(section => {
			const drawBorders = () => {
				drawRect(section.x, section.y, 1, collisions.size, 'green');
				drawRect(section.x, section.y + collisions.size, collisions.size, 1, 'green');
			}, drawPlayer = () => {
				if(collisions.playerPartitions.indexOf(section.id) > -1) drawRect(section.x, section.y, collisions.size, collisions.size, 'red');
			}, drawPlayerShots = () => {
				if(collisions.playerShotPartitions.indexOf(section.id) > -1) drawRect(section.x, section.y, collisions.size, collisions.size, 'red');
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



