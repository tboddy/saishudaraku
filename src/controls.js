let isFullscreen = false;

const toggleFullscreen = () => {
	if(isFullscreen){
		mainWindow.setFullScreen(false);
		isFullscreen = false;
	} else {
		mainWindow.setFullScreen(true);
		isFullscreen = true;
	}
},

mapControls = () => {
	const keysDown = e => {
		if(starting){
			// switch(e.which){}
		} else if(gameOver){
			// switch(e.which){}
		} else {
			switch(e.which){
				case 38: player.data.moving.up = true; break;
				case 40: player.data.moving.down = true; break;
				case 37: player.data.moving.left = true; break;
				case 39: player.data.moving.right = true; break;
				case 90: player.data.shooting = true; break;
				case 88: player.data.focus = true; break;
			}
		}
	}, keysUp = e => {
		if(starting){
			switch(e.which){
				case 90: starting = false; break;
				case 70: toggleFullscreen(); break;
				case 82: location.reload(); break;
			}
		} else if(gameOver){
			if(player.data.shooting) player.data.shooting = false;
			else {
				switch(e.which){
					case 70: toggleFullscreen(); break;
					case 82: location.reload(); break;
					case 90: location.reload(); break;
				}
			}
		} else {
			switch(e.which){
				case 38: player.data.moving.up = false; break;
				case 40: player.data.moving.down = false; break;
				case 37: player.data.moving.left = false; break;
				case 39: player.data.moving.right = false; break;
				case 90: player.data.shooting = false; break;
				case 88: player.data.focus = false; break;
				case 70: toggleFullscreen(); break;
				case 82: location.reload(); break;
			}
		}
	};
	document.addEventListener('keydown', keysDown);
	document.addEventListener('keyup', keysUp);
};