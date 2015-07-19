'use strict';
module.exports = function(grunt, config) {
	var srcJS = grunt.file.expand(config.SOURCE + '/vendor/js/*.js');
	var destJS = grunt.file.expand(config.DESTINATION + '/js/*.min.js');

	destJS.forEach(function(path) {
		if (path.indexOf("min.js") > 0) {
			var fileName = path.substr(path.lastIndexOf('/')+1);
			var minLess = fileName.replace(".min", "");

			srcJS.forEach(function(src){
				var srcName = src.substr(src.lastIndexOf('/')+1);

				if (srcName === minLess){
					var newName = src.replace(srcName, fileName);
					console.log(newName);
					console.log(true, srcName);

					grunt.config.set('clean.vendor', [src]);
					grunt.task.run('clean:vendor');

					grunt.config.set('copy.vendor', {
						src: path,
						dest: newName
					})
					grunt.task.run('copy:vendor');

				}
			})
		}
	})
};