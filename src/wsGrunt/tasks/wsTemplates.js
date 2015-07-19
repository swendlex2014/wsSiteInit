'use strict';
module.exports = function(grunt, config) {
	grunt.file.expand(config.DESTINATION + "/_temp/compile/*").forEach(function (dir) {
		var dirName = dir.substr(dir.lastIndexOf('/')+1);
		grunt.config.set('concat.' + dirName, {
			src: [dir + '/**'],
			dest: config.DESTINATION + '/_temp/ractive/' + dirName + '.html'
		});
		grunt.task.run('concat:' + dirName)
	});
};