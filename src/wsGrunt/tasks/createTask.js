'use strict';
module.exports = function(grunt, config) {
	var self = this;
	var target = process.argv[2];
	if (target.indexOf(":") === -1){
		console.log("=========+++++++++++++===========");
		console.error("Please specify a target!")
		console.log("Sample usage:")
		console.log("grunt createTask:taskname")
	}else {
		var tasks = grunt.file.expand(config.SOURCE + '/wsGrunt/tasks/*');
		target = target.substr(target.lastIndexOf(":") + 1);
		target = target.replace(".js", "");
		var stop = false;
		for (var i = 0; i < tasks.length; i++) {
			stop = (tasks[i].substr(tasks[i].lastIndexOf('/')+1).replace(".js", "") === target);
			if (stop === true)
				break;
		};

		if (stop === true){
			console.log(target, "already EXISTS as a task")
		} 
		else {
			console.log("Create new task", target);
			var content = "'use strict';\r\nmodule.exports = function(grunt, config) {\r\n\r\n};";
			grunt.file.write(config.SOURCE + '/wsGrunt/tasks/' + target + '.js', content)
		}
	}
};