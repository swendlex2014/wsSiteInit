'use strict';
module.exports = function(grunt, config) {
	grunt.file.expand(config.DESTINATION + "/js/*.js").forEach(function (path) {
		if (path.indexOf(".min.js") < 0) {
			var fileName = path.substr(path.lastIndexOf('/')+1);
			fileName = fileName.substr(0, fileName.length - 3);
			var dest = config.DESTINATION + "/js/" + fileName + ".min.js";
			var task =  {
				options: {
					preserveComments : false,
          mangle : true, // Can change variable name
          drop_console: true
     },
     files: {}
}
task.files[dest] = [path];
grunt.config.set('uglify.' + fileName, task);
grunt.task.run('uglify:' + fileName);
}
});
};