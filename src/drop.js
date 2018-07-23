const drop = {

	dump: {},

	data(enemy, isPower){
		let limit = 16;
		const pointSize = 12, position = {
			x: Math.round(enemy.position.x + enemy.size.x / 2) - pointSize / 2,
			y: Math.round(enemy.position.y + enemy.size.y / 2) - pointSize / 2
		};
		if(bossData) limit *= 1.5;
		let xMultiplier = Math.floor(Math.random() * limit), yMultiplier = Math.floor(Math.random() * limit);
		position.x += Math.floor(Math.random() * 2) ? xMultiplier : -xMultiplier;
		position.y += Math.floor(Math.random() * 2) ? yMultiplier : -yMultiplier;
		return {
			id: randomId(),
			size: {x: pointSize, y: pointSize},
			position: position,
			speed: {y: 2.25, x: 0},
			pullSpeed: 2.25,
			pullSpeedDiff: 0.5,
			speedDiff: -0.015,
			speedLimit: 1,
			img: isPower ? img.dropPower : img.dropPoint,
			value: isPower ? false : 500
		}
	},

	spawn(enemy){
		const points = () => {
			const dropItems = [];
			let dropCount = Math.round((gameHeight - (player.data.position.y - (enemy.position.y + enemy.size.y))) / 80);
			if(!dropCount) dropCount = 1;
			if(bossData) dropCount = dropCount * 5;
			for(i = 0; i < dropCount; i++){
				const dropItem = drop.data(enemy);
				drop.dump[dropItem.id] = dropItem;
			}
		}, power = () => {
			let powerCount = Math.floor(Math.random() * 2) + 1;
			if(bossData) powerCount = powerCount * 5;
			for(i = 0; i < powerCount; i++){
				const dropItem = drop.data(enemy, player.data.powerLevel < 100);
				drop.dump[dropItem.id] = dropItem;
			}
		};
		points();
		power();
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