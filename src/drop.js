const drop = {

	dump: {},

	pointData(enemy){
		let limit = 10;
		const pointSize = 12, position = {
			x: Math.round(enemy.position.x + enemy.size.x / 2) - pointSize / 2,
			y: Math.round(enemy.position.y + enemy.size.y / 2) - pointSize / 2
		};
		if(bossData) limit *= 2;
		let xMultiplier = Math.floor(Math.random() * limit), yMultiplier = Math.floor(Math.random() * limit);
		position.x += Math.floor(Math.random() * 2) ? xMultiplier : -xMultiplier;
		position.y += Math.floor(Math.random() * 2) ? yMultiplier : -yMultiplier;
		return {
			id: randomId(),
			size: {x: pointSize, y: pointSize},
			position: position,
			speed: {y: 2.5, x: 0},
			pullSpeed: 2.5,
			pullSpeedDiff: 0.25,
			speedDiff: -0.015,
			speedLimit: 1,
			img: img.dropPoint,
			value: 300
		}
	},

	spawnPoints(enemy){
		const dropItems = [];
		let dropCount = Math.round((gameHeight - (player.data.position.y - (enemy.position.y + enemy.size.y))) / 50);
		if(!dropCount) dropCount = 1;
		if(bossData) dropCount = dropCount * 2;
		for(i = 0; i < dropCount; i++){
			const dropItem = drop.pointData(enemy);
			drop.dump[dropItem.id] = dropItem;
		}
	},

	update(){
		if(Object.keys(drop.dump).length){
			for(id in drop.dump){
				const dropItem = drop.dump[id];
				dropItem.position.y += dropItem.speed.y;
				dropItem.position.x += dropItem.speed.x;
				if(dropItem.speedDiff && (dropItem.speed.y > dropItem.speedLimit)) dropItem.speed.y += dropItem.speedDiff;
				if(dropItem.position.y >= gameHeight) delete drop.dump[id];
			}
		}
	},

	draw(){
		if(Object.keys(drop.dump).length){
			for(id in drop.dump){
				const dropItem = drop.dump[id];
				drawImg(dropItem.img, dropItem.position.x, dropItem.position.y);
			}
		}
	}

};