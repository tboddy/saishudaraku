const img = {},

addImage = (dataName, fileName) => {
	img[dataName] = new Image();
	img[dataName].src = 'img/' + fileName + '.png';
};

addImage('player', 'player');
addImage('playerBullet', 'player-bullet');
addImage('enemyGirlOne', 'enemy-girlone');
addImage('enemyGirlTwo', 'enemy-girltwo');
addImage('enemyPulse', 'enemy-pulse-blue');
addImage('lunasa', 'enemy-lunasa');
addImage('lyrica', 'enemy-lyrica');
addImage('merlin', 'enemy-merlin');
addImage('bulletBlue', 'bullet-blue');
addImage('bulletBlueBig', 'bullet-big-blue');
addImage('bulletRed', 'bullet-red');
addImage('bulletRedBig', 'bullet-big-red');
addImage('font', 'font');
addImage('fontSmall', 'font-small');
addImage('yinYang', 'yinyang');
addImage('focus', 'focus');
addImage('power', 'power');
addImage('dropPoint', 'drop-point');
addImage('dropPower', 'drop-power');
addImage('playerlife', 'playerlife');
addImage('startLogo', 'startlogo');
addImage('start', 'start');
addImage('explosion', 'explosions');
addImage('screen', 'screen');
addImage('sidebar', 'sidebar');
addImage('leaves', 'leaves');
addImage('sidebarLogo', 'sidebarlogo');
addImage('background', 'background');
