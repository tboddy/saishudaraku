module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			development: {
				src: [
					/*'src/imagebank.js',
					'src/sounds.js',
					'src/setup.js',
					'src/collision.js',
					'src/start.js',
					'src/background.js',
					'src/drops.js',
					'src/explosion.js',
					'src/graze.js',
					'src/bullets.js',
					'src/waves/*.js',
					'src/enemies.js',
					'src/player.js',
					'src/playershot.js',
					'src/chrome.js',*/
					'src/imagebank.js',
					'src/sounds.js',
					'src/global.js',
					'src/controls.js',
					'src/chrome.js',
					'src/explosion.js',
					'src/start.js',
					'src/collision.js',
					'src/background.js',
					'src/enemies.js',
					'src/drop.js',
					'src/bullets-enemies.js',
					'src/bullets-player.js',
					'src/player.js',
					'src/game.js'
				],
				dest: 'game.js'
			}
		},
		watch: {
			files: ['src/*.js', 'src/*/*.js'],
			tasks: ['concat']
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['concat', 'watch']);
};