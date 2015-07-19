'use strict';
module.exports = function(grunt, config) {
	grunt.config.set('watch.configJsHelper', { 
		files: [config.SOURCE + '/script/config/*.js'], 
		tasks: ['appConfig'], 
		options: {livereload: true, spawn: false}
	});

	grunt.config.set('watch.scssFolders', { 
		files: [config.SOURCE + '/style/**/*.scss'], 
		tasks: ['wsSass'], 
		options: {livereload: true, spawn: false}
	});

	grunt.file.expand([config.SOURCE + '/ractive/*', config.SOURCE + '/script/*']).forEach(function (path){
		var fileName = path.substr(path.lastIndexOf('/')+1);
		fileName = fileName.substr(0, fileName.length - 3);

		grunt.config.set('copy.' + fileName, {
			src: path,
			dest: config.DESTINATION + "/js/" + fileName + ".js"
		});

		grunt.config.set('watch.' + fileName, { 
			files: [path], 
			tasks: ['copy:' + fileName, 'uglify:' + fileName, 'clean:js'], 
			options: {livereload: true, spawn: false}
		});
	})

	grunt.file.expand([config.SOURCE + '/indexer/*']).forEach(function (path){
		var fileName = path.substr(path.lastIndexOf('/')+1);
		var subName = fileName.substr(0, fileName.length - 5);
		grunt.config.set('copy.' + subName, {
			src: path,
			dest: config.DESTINATION + "/" + fileName
		});

		grunt.config.set('watch.' + subName, { 
			files: [path], 
			tasks: ['copy:' + subName, 'replace:' + subName], 
			options: {livereload: true, spawn: false}
		});
	})

	grunt.file.expand([config.SOURCE + '/nodejs/*']).forEach(function (path){
		var fileName = path.substr(path.lastIndexOf('/')+1);
		var subName = "node" + fileName.substr(0, fileName.length - 3);

		grunt.config.set('copy.' + subName, {
			src: path,
			dest: config.NODE + "/" + fileName
		});

		grunt.config.set('watch.' + subName, { 
			files: [path], 
			tasks: ['copy:' + subName], 
			options: {livereload: true, spawn: false}
		});
	})
};