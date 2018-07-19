const drop = {

	dump: {},

	data(position){
		position.x -= 8;
		position.y -= 8;
		return {
			size: {x: 16, y: 16},
			position: position,
			speed: 0.75
		}
	},

	spawn(position){
		const dropItem = drop.data(position);
		if(!drop.dump[dropItem.id]) drop.dump[dropItem.id] = dropItem;
	},

	update(){
		if(Object.keys(drop.dump).length){
			for(id in drop.dump){
				const dropItem = drop.dump[id];
				dropItem.position.y += dropItem.speed;
			}
		}
	},

	draw(){

		if(Object.keys(drop.dump).length){
			for(id in drop.dump){
				const dropItem = drop.dump[id];
				drawImg(img.power, dropItem.position.x, dropItem.position.y);
			}
		}
	}

};