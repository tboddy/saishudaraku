const isMuted = false,

sounds = {
	bulletOne: new Howl({src: ['sound/bullet1.wav'], volume: .1}),
	bulletTwo: new Howl({src: ['sound/bullet2.wav'], volume: .1}),
	bulletThree: new Howl({src: ['sound/bullet3.wav'], volume: .1}),
	bulletPlayer: new Howl({src: ['sound/explosion.wav'], volume: 1}),
	explosion: new Howl({src: ['sound/explosion.wav'], volume: .5}),
	graze: new Howl({src: ['sound/graze.wav'], volume: 0.1})
	// bgmOne: new Howl({src: ['sound/bgm1.mp3'], volume: 0.75})
};

if(isMuted){
	for(soundName in sounds){
		sounds[soundName].volume(0);
	};
}

const clearBullets = () => {
	if(sounds.bulletOne.playing()) sounds.bulletOne.stop();
	if(sounds.bulletTwo.playing()) sounds.bulletTwo.stop();
	if(sounds.bulletThree.playing()) sounds.bulletThree.stop();
},

spawnSound = {

	bulletOne(){
		clearBullets()
		sounds.bulletOne.play();
	},

	bulletTwo(){
		clearBullets()
		sounds.bulletTwo.play();
	},

	bulletThree(){
		clearBullets()
		sounds.bulletThree.play();
	},

	explosion(){
		if(sounds.explosion.playing()) sounds.explosion.stop();
		sounds.explosion.play();
	},

	graze(){
		if(sounds.graze.playing()) sounds.graze.stop();
		sounds.graze.play();
	},

	bulletPlayer(){
		if(sounds.bulletPlayer.playing()) sounds.bulletPlayer.stop();
		sounds.bulletPlayer.play();
	},

	// bgmOne(){
	// 	sounds.bgmOne.play();
	// }

}