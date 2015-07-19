'use strict';
module.exports = function(grunt, config, modRewrite) {
// Project configuration.
grunt.initConfig({
	pkg: grunt.file.readJSON('./package.json'),
	uglify : {},
	surround : {},
	replace : {},
	cssmin: {
		target: {
			files: [{
				expand: true,
				cwd: config.DESTINATION + '/css',
				src: ['*.css', '!*.min.css'],
				dest: config.DESTINATION + '/css',
				ext: '.min.css'
			}]
		}
	},

	sass: {
		styles: {
			options : {
				style : 'compressed'
			},
			files: [{
				expand: true,
				cwd: config.SOURCE + '/style',
				src: ['*.scss'],
				dest: config.DESTINATION + '/css',
				ext: '.min.css'
			}]
		}
	},

	copy: {
		img: { files: [ {expand: true, cwd: config.SOURCE + '/img', src: ['**'], dest: config.DESTINATION + '/img'}, ] },
		vendor: { files: [ {expand: true, cwd: config.SOURCE + '/vendor/', src: ['**'], dest: config.DESTINATION}, ] },
		index: { files: [ {expand: true, cwd: config.SOURCE + '/indexer/', src: ['**'], dest: config.DESTINATION}, ] },
		ractive: { files: [ {expand: true, cwd: config.SOURCE + '/ractive/', src: ['**'], dest: config.DESTINATION + '/js'}, ] },
		node: { files: [ {expand: true, cwd: config.SOURCE + '/nodejs/', src: ['*.js', '!start.js'], dest: config.NODE},{expand: true, cwd: config.SOURCE + '/nodejs/', src: ['start.js'], dest: ''} ] },
	},

	watch: {
		gruntjs: { files: ['Gruntfile.js'], tasks: ['prod'], options: {livereload: true}},           
		vendor: { files: [config.SOURCE + '/vendor/*', config.SOURCE + '/vendor/**/*'], tasks: ['copy:vendor'], options: {livereload: true}},           
		index: { files: [config.SOURCE + '/indexer/*', config.SOURCE + '/indexer/**/*'], tasks: ['ractive'], options: {livereload: true}},           
		img: { files: [config.SOURCE + '/img/*', config.SOURCE + '/img/**/*'], tasks: ['copy:img'], options: {livereload: true}},           
		cssmin: { files: [config.SOURCE + '/style/*.css'], tasks: ['cssmin'], options: {livereload: true}},           
		sass: { files: [config.SOURCE + '/style/*.scss'], tasks: ['sass'], options: {livereload: true}},           
		nodejs: { files: [config.SOURCE + '/nodejs/*', config.SOURCE + '/nodejs/**/*'], tasks: ['copy:node'], options: {livereload: true}},  
		templates: { files: [config.SOURCE + '/templates/**/*',  config.SOURCE + 'templates/**/**/*'], tasks: ['ractive'], options: {livereload: true}},           
	},

	clean: {
		dist: [config.DESTINATION],
		temp : [config.DESTINATION + '/_temp'],
		css : [config.DESTINATION + '/css/*.css', '!' + config.DESTINATION + '/css/*.min.css'],
		js : [config.DESTINATION + '/js/*.js', '!' + config.DESTINATION + '/js/*.min.js'],
		node : ["node"]
	},

	connect: {
		server: {
			options: {
				hostname: 'localhost',
				port: config.SERVER_PORT,
				base: [config.DESTINATION],
				livereload: true,
				keepalive : grunt.cli.tasks[0] === "start",
				open : grunt.cli.tasks[0] === "start",
				onCreateServer: function(server, connect, options) {
					var port = process.env.PORT || config.SERVER_PORT;
					var express = require('express');
					var app = express();
					var io = require('socket.io').listen(server);
					var request = require('request');
					require('./../../../node/config.js')(app, io, express, port);
					require('./../../../node/sockets.js')(app, io, express, port);
				},
				middleware: function(connect, options) {
					var middlewares;
					middlewares = [];
					middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]', 
						'!\\assets|\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg$ /index.html [L]']));
					options.base.forEach(function(base) {
						return middlewares.push(connect["static"](base));
					});
					return middlewares;
				}
			}
		}
	},
});
};