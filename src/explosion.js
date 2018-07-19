const explosions = {

	dump: [],
	interval: 5,
	spawnTime: 12,
	spawnClock: 0,

	data(){
		return {
			size: 32,
			clock: 0,
			offset: 0
		}
	},

	spawn(bullet, enemy){
		if(explosions.spawnClock == 0){
			const explosionObj = explosions.data();
			explosionObj.x = (bullet.x + bullet.width / 2) - (explosionObj.size / 2);
			explosionObj.y = (bullet.y + bullet.height / 2) - (explosionObj.size / 2);
			if(enemy){
				explosionObj.x += enemy.width / 2;
				explosionObj.y += enemy.height / 2;
			}
			explosionObj.offset = -explosionObj.size;
			explosions.dump.push(explosionObj);
			explosions.spawnClock = 1;
			spawnSound.explosion();
		}
	},

	update(){
		if(explosions.spawnClock >= explosions.spawnTime) explosions.spawnClock = 0;
		else if(explosions.spawnClock != 0) explosions.spawnClock++;
		if(explosions.dump.length){
			const updateExplosion = (explosion, i) => {
				if(explosion.clock % explosions.interval == 0) explosion.offset += explosion.size;
				explosion.clock++;
				if(explosion.offset > explosion.size * 4) explosions.dump.splice(i, 1)
			};
			explosions.dump.forEach(updateExplosion)
		}
	},

	draw(){
		if(explosions.dump.length){
			const drawExplosion = explosion => {
				context.drawImage(img.explosion, explosion.offset, 0, explosion.size, explosion.size, explosion.x, explosion.y, explosion.size,
					explosion.size);
			};
			explosions.dump.forEach(drawExplosion)
		}
	}

};