let totalGraze = 0;

const pointChrome = {

	dump: {},

	data(src, input){
		const grazeSize = 8 * input.length, angle = getAngle(src, {
			position: {x: collisions.boundingBox().x, y: collisions.boundingBox().y},
			size: {x: collisions.boundingBox().width, y: collisions.boundingBox().height},
		}), speedMulti = 0.75;
		return {
			id: randomId(),
			position: {
				x: Math.round(src.position.x + src.size.x / 2 - grazeSize / 2),
				y: Math.round(src.position.y + src.size.y / 2 - grazeSize / 2)
			},
			speed: {x: Math.cos(angle) * speedMulti, y: Math.sin(angle) * speedMulti},
			size: grazeSize,
			text: input,
			clock: 0,
			limit: 30
		}
	},

	spawn(src, input){
		const grazeItem = pointChrome.data(src, String(input));
		pointChrome.dump[grazeItem.id] = grazeItem;
	},

	update(){
		if(Object.keys(pointChrome.dump).length){
			for(id in pointChrome.dump){
				const grazeItem = pointChrome.dump[id];
				grazeItem.position.y += grazeItem.speed.y;
				grazeItem.position.x += grazeItem.speed.x;
				grazeItem.clock++;
				if(grazeItem.clock > grazeItem.limit) delete pointChrome.dump[grazeItem.id]
			}
		}
	},

	draw(){
		if(Object.keys(pointChrome.dump).length){
			for(id in pointChrome.dump){
				const grazeItem = pointChrome.dump[id];
				utilities.drawString(grazeItem.text, grazeItem.position.x, grazeItem.position.y);
			}
		}
	}

};