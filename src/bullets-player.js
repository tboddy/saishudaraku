const bulletsPlayer = {

	data(type){
		const bulletObject = {
			size: {x: 8, y: 12},
			speed: {x: 0, y: 18},
			id: randomId()
		};
		bulletObject.position = {x: player.data.position.x + player.data.size.x / 2 - bulletObject.size.x / 2, y: player.data.position.y}
		if(type){
			bulletObject.type = type;
			const xOffset = 15;
			switch(type){
				case 'leftA': bulletObject.position.x -= bulletObject.size.x - xOffset; break;
				case 'rightA': bulletObject.position.x += bulletObject.size.x - xOffset; break;
				case 'leftB':
					bulletObject.position.x -= bulletObject.size.x * 2 - xOffset * 2;
					bulletObject.position.y += 1;
					break;
				case 'rightB':
					bulletObject.position.x += bulletObject.size.x * 2 - xOffset * 2;
					bulletObject.position.y += 1;
					break;
				case 'leftC':
					bulletObject.position.x -= bulletObject.size.x * 3 - xOffset * 3;
					bulletObject.position.y += 2;
					break;
				case 'rightC':
					bulletObject.position.x += bulletObject.size.x * 3 - xOffset * 3;
					bulletObject.position.y += 2;
					break;
				case 'leftD':
					bulletObject.position.x -= bulletObject.size.x * 4 - xOffset * 4;
					bulletObject.position.y += 4;
					break;
				case 'rightD':
					bulletObject.position.x += bulletObject.size.x * 4 - xOffset * 4;
					bulletObject.position.y += 4;
					break;
				case 'leftE':
					bulletObject.position.x -= bulletObject.size.x * 5 - xOffset * 5;
					bulletObject.position.y += 8;
					break;
				case 'rightE':
					bulletObject.position.x += bulletObject.size.x * 5 - xOffset * 5;
					bulletObject.position.y += 8;
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
		if(player.data.powerLevel >= 25){
			bulletsArray.push(bulletsPlayer.data('leftB'));
			bulletsArray.push(bulletsPlayer.data('rightB'));
			if(player.data.powerLevel >= 50){
				bulletsArray.push(bulletsPlayer.data('leftC'));
				bulletsArray.push(bulletsPlayer.data('rightC'));
				if(player.data.powerLevel >= 75){
					bulletsArray.push(bulletsPlayer.data('leftD'));
					bulletsArray.push(bulletsPlayer.data('rightD'));
					if(player.data.powerLevel == 100){
						bulletsArray.push(bulletsPlayer.data('leftE'));
						bulletsArray.push(bulletsPlayer.data('rightE'));
					} 
				} 
			} 
		}
		bulletsArray.forEach(bullet => {
			bulletsPlayer.dump[bullet.id] = bullet;
		});
		spawnSound.bulletPlayer();
	},

	update(){

		const doBullet = bullet => {
			let ySpeed = bullet.speed.y;
			if(player.data.moving.up) ySpeed += player.data.focus ? player.data.speedSlow : player.data.speed;
			else if(player.data.moving.down) ySpeed -= player.data.focus ? player.data.speedSlow : player.data.speed;
			ySpeed++;
			const doTypes = () => {
				const speed = 1, aDiff = .99, bDiff = .97, cDiff = .94, dDiff = .9, eDiff = .84;
				switch(bullet.type){
					case 'leftA': bullet.position.x += speed; break;
					case 'rightA': bullet.position.x -= speed; break;
					case 'leftB': bullet.position.x += speed * 2; break;
					case 'rightB': bullet.position.x -= speed * 2; break;
					case 'leftC': bullet.position.x += speed * 3; break;
					case 'rightC': bullet.position.x -= speed * 3; break;
					case 'leftD': bullet.position.x += speed * 4; break;
					case 'rightD': bullet.position.x -= speed * 4; break;
					case 'leftE': bullet.position.x += speed * 5; break;
					case 'rightE': bullet.position.x -= speed * 5; break;
				}
			}
			if(bullet.type) doTypes();
			bullet.position.y -= ySpeed;
			if(bullet.position.y < 0 - bullet.size.y) delete bulletsPlayer.dump[id];
		},

		doFocus = () => {
			// console.log('focus')
			if(!player.data.focusData){
				player.data.focusData = {height: 0};
				player.data.focus = true;
			}
			player.data.focusData.x = player.data.position.x;
			if(player.data.powerLevel < 25) player.data.focusData.width = 8;
			else if(player.data.powerLevel >= 25 && player.data.powerLevel < 50) player.data.focusData.width = 12;
			else if(player.data.powerLevel >= 50 && player.data.powerLevel < 75) player.data.focusData.width = 18;
			else if(player.data.powerLevel >= 75 && player.data.powerLevel < 100) player.data.focusData.width = 24;
			else if(player.data.powerLevel == 100) player.data.focusData.width = 32;
			player.data.focusData.x += player.data.size.x / 2 - player.data.focusData.width / 2;
			if(player.data.moving.left) player.data.focusData.x -= player.data.moveOffset;
			else if(player.data.moving.right) player.data.focusData.x += player.data.moveOffset;
			if(player.data.focusColliding) player.data.focusMax -= enemy.position.y + enemy.size.y;
			if(player.data.focusData.height < player.data.focusMax) player.data.focusData.height += player.data.focusGrow;
			else if(player.data.focusData.height > player.data.focusMax) player.data.focusData.height = player.data.focusMax;
			// console.log(player.data.focusColliding)
			player.data.focusData.y = player.data.position.y - player.data.focusData.height - 4;
		};

		if(player.data.shooting && !gameOver){
			if(player.data.focus) doFocus();
			else if(player.data.shotClock % player.data.shotTime == 0) bulletsPlayer.spawn();
			player.data.shotClock++;
		} else {
			if(player.data.shotClock) player.data.shotClock = 0;
			if(player.data.focusData) player.data.focusData = false;
		}

		if(Object.keys(bulletsPlayer.dump).length) for(id in bulletsPlayer.dump) doBullet(bulletsPlayer.dump[id]);
	},

	draw(){

		const doBullet = bullet => {
			drawImg(img.playerBullet, bullet.position.x, bullet.position.y, bullet.size.x, bullet.size.y);
		},

		doFocus = () => {
			drawRect(player.data.focusData.x, player.data.focusData.y,
				player.data.focusData.width, player.data.focusData.height, colors.red);
			drawRect(player.data.focusData.x + 1, player.data.focusData.y,
				player.data.focusData.width - 2, player.data.focusData.height, colors.peach);
			drawRect(player.data.focusData.x + 1, player.data.focusData.y + player.data.focusData.height,
				player.data.focusData.width - 2, 1, colors.red);
			if(player.data.focusColliding){
				drawRect(player.data.focusData.x + 1, player.data.focusData.y - 1, player.data.focusData.width - 2, 1, colors.red);
			}
		};

		if(Object.keys(bulletsPlayer.dump).length) for(id in bulletsPlayer.dump) doBullet(bulletsPlayer.dump[id]);
		if(player.data.focus) doFocus();

	}

};