const bulletsPlayer = {

	data(type){
		const bulletObject = {
			size: {x: 8, y: 12},
			speed: {x: 0, y: 20},
			id: randomId()
		};
		bulletObject.position = {x: player.data.position.x + player.data.size.x / 2 - bulletObject.size.x / 2, y: player.data.position.y}
		if(type){
			bulletObject.type = type;
			const yOffset = 1, xOffset = 4;
			switch(type){
				case 'leftA':
					bulletObject.position.x -= bulletObject.size.x - xOffset;
					bulletObject.position.y += yOffset;
					break;
				case 'rightA':
					bulletObject.position.x += bulletObject.size.x - xOffset;
					bulletObject.position.y += yOffset;
					break;
				case 'leftB':
					bulletObject.position.x -= bulletObject.size.x * 2 - xOffset * 2;
					bulletObject.position.y += yOffset * 2;
					break;
				case 'rightB':
					bulletObject.position.x += bulletObject.size.x * 2 - xOffset * 2;
					bulletObject.position.y += yOffset * 2;
					break;
				case 'leftC':
					bulletObject.position.x -= bulletObject.size.x * 3 - xOffset * 3;
					bulletObject.position.y += yOffset * 4;
					break;
				case 'rightC':
					bulletObject.position.x += bulletObject.size.x * 3 - xOffset * 3;
					bulletObject.position.y += yOffset * 4;
					break;
				case 'leftD':
					bulletObject.position.x -= bulletObject.size.x * 4 - xOffset * 4;
					bulletObject.position.y += yOffset * 6;
					break;
				case 'rightD':
					bulletObject.position.x += bulletObject.size.x * 4 - xOffset * 4;
					bulletObject.position.y += yOffset * 6;
					break;
				case 'leftE':
					bulletObject.position.x -= bulletObject.size.x * 5 - xOffset * 5;
					bulletObject.position.y += yOffset * 8;
					break;
				case 'rightE':
					bulletObject.position.x += bulletObject.size.x * 5 - xOffset * 5;
					bulletObject.position.y += yOffset * 8;
					break;
			}
		}
		return bulletObject;
	},

	dump: {},

	spawn(){
		const bulletsArray = [
			bulletsPlayer.data(),
			bulletsPlayer.data('leftA'),
			bulletsPlayer.data('rightA')
		];
		if(player.data.powerLevel >= 2){
			bulletsArray.push(bulletsPlayer.data('leftB'));
			bulletsArray.push(bulletsPlayer.data('rightB'));
			if(player.data.powerLevel >= 3){
				bulletsArray.push(bulletsPlayer.data('leftC'));
				bulletsArray.push(bulletsPlayer.data('rightC'));
				if(player.data.powerLevel >= 4){
					bulletsArray.push(bulletsPlayer.data('leftD'));
					bulletsArray.push(bulletsPlayer.data('rightD'));
					if(player.data.powerLevel >= 5){
						bulletsArray.push(bulletsPlayer.data('leftE'));
						bulletsArray.push(bulletsPlayer.data('rightE'));
					} 
				} 
			} 
		}
		bulletsArray.forEach(bullet => {
			bulletsPlayer.dump[bullet.id] = bullet;
		});
		spawnSound.bulletPlayer()
	},

	update(){
		if(player.data.shooting && !gameOver){
			if(player.data.shotClock % player.data.shotTime == 0 || player.data.shotClock % player.data.shotTime == 5 ||
				player.data.shotClock % player.data.shotTime == 10) bulletsPlayer.spawn();
			player.data.shotClock++;
		} else if(player.data.shotClock) player.data.shotClock = 0;

		const doBullet = bullet => {
			let ySpeed = bullet.speed.y;
			if(player.data.moving.up) ySpeed += player.data.focus ? player.data.speedSlow : player.data.speed;
			else if(player.data.moving.down) ySpeed -= player.data.focus ? player.data.speedSlow : player.data.speed;
			ySpeed++;
			const doTypes = () => {
				const speed = 2, aDiff = .99, bDiff = .97, cDiff = .94, dDiff = .9, eDiff = .84;
				switch(bullet.type){
					case 'leftA':
						bullet.position.x -= speed;
						bullet.position.y -= ySpeed * aDiff;
						break;
					case 'rightA':
						bullet.position.x += speed;
						bullet.position.y -= ySpeed * aDiff;
						break;
					case 'leftB':
						bullet.position.x -= speed * 2;
						bullet.position.y -= ySpeed * bDiff;
						break;
					case 'rightB':
						bullet.position.x += speed * 2;
						bullet.position.y -= ySpeed * bDiff;
						break;
					case 'leftC':
						bullet.position.x -= speed * 3;
						bullet.position.y -= ySpeed * cDiff;
						break;
					case 'rightC':
						bullet.position.x += speed * 3;
						bullet.position.y -= ySpeed * cDiff;
						break;
					case 'leftD':
						bullet.position.x -= speed * 4;
						bullet.position.y -= ySpeed * dDiff;
						break;
					case 'rightD':
						bullet.position.x += speed * 4;
						bullet.position.y -= ySpeed * dDiff;
						break;
					case 'leftE':
						bullet.position.x -= speed * 5;
						bullet.position.y -= ySpeed * eDiff;
						break;
					case 'rightE':
						bullet.position.x += speed * 5;
						bullet.position.y -= ySpeed * eDiff;
						break;
				}
			}
			if(bullet.type) doTypes();
			else bullet.position.y -= ySpeed;
			if(bullet.position.y < 0 - bullet.size.y) delete bulletsPlayer.dump[id];
		}

		if(Object.keys(bulletsPlayer.dump).length) for(id in bulletsPlayer.dump) doBullet(bulletsPlayer.dump[id]);
	},

	draw(){
		const doBullet = bullet => {
			drawImg(img.playerBullet, bullet.position.x, bullet.position.y, bullet.size.x, bullet.size.y);
		}
		if(Object.keys(bulletsPlayer.dump).length) for(id in bulletsPlayer.dump) doBullet(bulletsPlayer.dump[id]);
	}

};