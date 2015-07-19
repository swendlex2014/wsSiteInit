'use strict';
module.exports = function(grunt, config) {
	var self = this;
	var styles = grunt.file.expand(config.SOURCE + '/style/*');
	for (var i = 0; i < styles.length; i++) {
		var dir = styles[i];
		var dirName = dir.substr(dir.lastIndexOf('/')+1);
		if (dirName.indexOf(".") === -1){
			grunt.config.set('concat.' + dirName, {
				src: [dir + '/*.scss'],
				dest: config.DESTINATION + '/_temp/scss/' + dirName + '.scss'
			});
			grunt.task.run('concat:' + dirName);
		}
	};

	grunt.config.set('sass.' + dirName, {
		options : {
			style : 'compressed'
		},
		files: [{
			expand: true,
			cwd: config.DESTINATION + '/_temp/scss',
			src: ['*.scss'],
			dest: config.DESTINATION + '/css',
			ext: '.min.css'
		}]
	})
	grunt.task.run('sass:' + dirName);
};