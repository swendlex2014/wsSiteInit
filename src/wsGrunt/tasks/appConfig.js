'use strict';
module.exports = function(grunt, config) {
	var functions = grunt.file.expand(config.SOURCE + '/script/config/*.js');
	var options = {
		port : config.SERVER_PORT,
		host : config.APP_HOST,
		serv : config.REMOVE_SERVER,
		hosts : config.LIVE_HOST
	}
	var vars = "var options = " + JSON.stringify(options) + ";";
	var appConfig = "var appConfig = { options: options";
	for (var i = 0; i < functions.length; i++) {
		var path = functions[i];
		var fileName = path.substr(path.lastIndexOf('/')+1);
		fileName = fileName.substr(0, fileName.length - 3);
		var content = grunt.file.read(path);
		var obj = "";
		var fIndex = content.indexOf("function(");
			if (fIndex === 0){
				obj = "function " + fileName + content.substr(content.indexOf("("));
			}
			else {
				obj = "var " + fileName + " = " + content + ";";
			}
			vars += obj;
			appConfig += "," + fileName + ":" + fileName;
		}
		appConfig = vars + appConfig + "};(function($){ $.app = appConfig;})($);";
		grunt.file.write(config.DESTINATION + '/js/appConfig.js', appConfig);
		console.log("Configuration file generated!");
	};