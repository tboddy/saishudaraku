let currentWave = 'one';

const enemies = {

	dump: {}, data: {}, waves: {},

	spawn(enemy){
		enemies.shown = false;
		enemies.dump[enemy.id] = enemy;
	},

	update(){
		if(Object.keys(enemies.dump).length){
			for(id in enemies.dump){
				const enemy = enemies.dump[id];
				enemy.update();
				if(enemy.position.y + enemy.size.y >= 0 && enemy.position.x + enemy.size.y >= 0 &&
					enemy.position.x <= gameWidth && !enemy.shown) enemy.shown = true;
				if((enemy.position.y + enemy.size.y < -enemy.size.y || enemy.position.y > gameHeight || enemy.position.x + enemy.size.x < -enemy.size.x ||
					enemy.position.x > gameWidth) && enemy.shown) delete enemies.dump[id];
				if(enemy.health < 1){
					currentScore += enemy.score;
					drop.spawn(enemy);
					pointChrome.spawn(enemy, enemy.score);
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
					context.drawImage(enemy.image, xOffset, 0, enemy.size.x, enemy.size.y, Math.floor(enemy.position.x), Math.floor(enemy.position.y), enemy.size.x, enemy.size.y);
				} else drawImg(enemy.image, enemy.position.x, enemy.position.y, enemy.size.x, enemy.size.y);
			}
		}
	}

};