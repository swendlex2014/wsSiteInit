'use strict';
module.exports = function(grunt, config) {
 // get all templates directories
 grunt.file.expand(config.SOURCE + "/templates/*").forEach(function (dir) {
 	var dirName = dir.substr(dir.lastIndexOf('/')+1);
 	grunt.file.expand(dir + "/*").forEach(function (filepath) {
 		var startIndex = filepath.lastIndexOf('/');
 		var lastIndex = filepath.lastIndexOf('.');
 		var fileName = filepath.substr(startIndex + 1, lastIndex - startIndex - 1);
 		grunt.config.set('surround.' + dirName + fileName, {
 			options: {
 				prepend : "<script id='" + fileName+ "' type='text/ractive'>",
 				append : "</script>"
 			},
 			files: [{
 				src: filepath,
 				dest: config.DESTINATION + '/_temp/compile/' + dirName + '/' + fileName + '.html'
 			}]
 		});
 		grunt.task.run(['surround:' + dirName + fileName]);
 	});
 })
};