'use strict';
module.exports = function(grunt, config) {
	grunt.config.set('replace.indexer' , {
		options: {
			patterns: [
			{
				match: 'base',
				replacement: (grunt.cli.tasks[0] === "start")? config.LIVE_HOST[0] : config.APP_HOST
			}
			]
		},
		files: [
		{expand: true, flatten: true, src: [config.DESTINATION + '/index.html'], dest: config.DESTINATION + '/'}
		]
	});
	grunt.task.run('replace:indexer');

	grunt.file.expand(config.DESTINATION + "/_temp/compile/*").forEach(function (dir) {
		var dirName = dir.substr(dir.lastIndexOf('/')+1);
		grunt.config.set('replace.' + dirName, {
			options: {
				patterns: [
				{
					match: 'ractiveTemplate',
					replacement: '<%= grunt.file.read("www/_temp/ractive/' + dirName + '.html") %>'
				}
				]
			},
			files: [
			{expand: true, flatten: true, src: [config.DESTINATION + '/' + dirName + '.html'], dest: config.DESTINATION + ''}
			]
		});
		grunt.task.run('replace:' + dirName);
	});
};