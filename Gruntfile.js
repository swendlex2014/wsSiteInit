module.exports = function(grunt) {

 var SERVER_PORT = "7777";
 var APP_HOST = "http://localhost:" + SERVER_PORT;
 var LIVE_HOST = ["http://books.wspecs.com", APP_HOST, "http://wspecs.com/books",]
 var REMOVE_SERVER = "http://servone.wspecs.com/books/";
 var destination = 'www';
 var source = 'src'
 var nodeFolder = 'node';
 var modRewrite = require('connect-modrewrite');


    // Display the execution time when tasks are run:
    require('time-grunt')(grunt);

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
          cwd: destination + '/css',
          src: ['*.css', '!*.min.css'],
          dest: destination + '/css',
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
          cwd: source + '/style',
          src: ['*.scss'],
          dest: destination + '/css',
          ext: '.min.css'
        }]
      }
    },

    copy: {
     img: { files: [ {expand: true, cwd: source + '/img', src: ['**'], dest: destination + '/img'}, ] },
     vendor: { files: [ {expand: true, cwd: source + '/vendor/', src: ['**'], dest: destination}, ] },
     index: { files: [ {expand: true, cwd: source + '/indexer/', src: ['**'], dest: destination}, ] },
     ractive: { files: [ {expand: true, cwd: source + '/ractive/', src: ['**'], dest: destination + '/js'}, ] },
     // script: { files: [ {expand: true, cwd: source + '/script/', src: ['**'], dest: destination + '/js'}, ] },
     node: { files: [ {expand: true, cwd: source + '/nodejs/', src: ['*.js', '!start.js'], dest: nodeFolder},{expand: true, cwd: source + '/nodejs/', src: ['start.js'], dest: ''} ] },
     img: { files: [ {expand: true, cwd: source + '/img/', src: ['**'], dest: destination + '/img'}, ] },
   },

   watch: {
     gruntjs: { files: ['Gruntfile.js'], tasks: ['prod'], options: {livereload: true}},           
     vendor: { files: [source + '/vendor/*', source + '/vendor/**/*'], tasks: ['copy:vendor'], options: {livereload: true}},           
     index: { files: [source + '/indexer/*', source + '/indexer/**/*'], tasks: ['ractive'], options: {livereload: true}},           
     img: { files: [source + '/img/*', source + '/img/**/*'], tasks: ['copy:img'], options: {livereload: true}},           
     cssmin: { files: [source + '/style/*.css'], tasks: ['cssmin'], options: {livereload: true}},           
     sass: { files: [source + '/style/*.scss'], tasks: ['sass'], options: {livereload: true}},           
     nodejs: { files: [source + '/nodejs/*', source + '/nodejs/**/*'], tasks: ['copy:node'], options: {livereload: true}},  
     templates: { files: [source + '/templates/**/*',  source + 'templates/**/**/*'], tasks: ['ractive'], options: {livereload: true}},           
   },

   clean: {
    dist: [destination],
    temp : [destination + '/_temp'],
    css : [destination + '/css/*.css', '!' + destination + '/css/*.min.css'],
    js : [destination + '/js/*.js', '!' + destination + '/js/*.min.js'],
    node : ["node"]
  },

  connect: {
    server: {
     options: {
      hostname: 'localhost',
      port: SERVER_PORT,
      base: [destination],
      livereload: true,
      keepalive : grunt.cli.tasks[0] === "start",
      open : grunt.cli.tasks[0] === "start",
      onCreateServer: function(server, connect, options) {
       var port = process.env.PORT || SERVER_PORT;
       var express = require('express');
       var app = express();
       var io = require('socket.io').listen(server);
       var request = require('request');
       require('./node/config.js')(app, io, express, port);
       require('./node/sockets.js')(app, io, express, port);
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

grunt.registerTask("wsWatch", "Watch source files and run appropriate commands", function(){
  grunt.config.set('watch.configJsHelper', { 
   files: [source + '/script/config/*.js'], 
   tasks: ['config'], 
   options: {livereload: true, spawn: false}
 });

  grunt.file.expand([source + '/ractive/*', source + '/script/*']).forEach(function (path){
    var fileName = path.substr(path.lastIndexOf('/')+1);
    fileName = fileName.substr(0, fileName.length - 3);

    grunt.config.set('copy.' + fileName, {
     src: path,
     dest: destination + "/js/" + fileName + ".js"
   });

    grunt.config.set('watch.' + fileName, { 
     files: [path], 
     tasks: ['copy:' + fileName, 'uglify:' + fileName, 'clean:js'], 
     options: {livereload: true, spawn: false}
   });
  })

  grunt.file.expand([source + '/indexer/*']).forEach(function (path){
    var fileName = path.substr(path.lastIndexOf('/')+1);
    var subName = fileName.substr(0, fileName.length - 3);

    grunt.config.set('copy.' + subName, {
     src: path,
     dest: destination + "/" + fileName
   });

    grunt.config.set('watch.' + subName, { 
     files: [path], 
     tasks: ['copy:' + subName, 'replace:' + subName], 
     options: {livereload: true, spawn: false}
   });
  })

  grunt.file.expand([source + '/nodejs/*']).forEach(function (path){
    var fileName = path.substr(path.lastIndexOf('/')+1);
    var subName = "node" + fileName.substr(0, fileName.length - 3);

    grunt.config.set('copy.' + subName, {
     src: path,
     dest: nodeFolder + "/" + fileName
   });

    grunt.config.set('watch.' + subName, { 
     files: [path], 
     tasks: ['copy:' + subName], 
     options: {livereload: true, spawn: false}
   });
  })
})

grunt.registerTask('wsRactive', 'Process where ractiveJs', function(){
 // get all templates directories
 grunt.file.expand(source + "/templates/*").forEach(function (dir) {
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
      dest: destination + '/_temp/compile/' + dirName + '/' + fileName + '.html'
    }]
  });
    grunt.task.run(['surround:' + dirName + fileName]);
  });
 })
});

grunt.registerTask("wsReplace", "Finds and prepares templates.", function() {
  grunt.config.set('replace.indexer' , {
   options: {
    patterns: [
    {
      match: 'base',
      replacement: (grunt.cli.tasks[0] === "start")? LIVE_HOST[0] : APP_HOST
    }
    ]
  },
  files: [
  {expand: true, flatten: true, src: [destination + '/index.html'], dest: destination + '/'}
  ]
});
  grunt.task.run('replace:indexer');

  grunt.file.expand(destination + "/_temp/compile/*").forEach(function (dir) {
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
   {expand: true, flatten: true, src: [destination + '/' + dirName + '.html'], dest: destination + ''}
   ]
 });
    grunt.task.run('replace:' + dirName);
  });
});

grunt.registerTask("wsMinifyJS", "This task minify all Javascript files in the www/js folder ", function(){
 grunt.file.expand(destination + "/js/*.js").forEach(function (path) {
  if (path.indexOf(".min.js") < 0) {
   var fileName = path.substr(path.lastIndexOf('/')+1);
   fileName = fileName.substr(0, fileName.length - 3);
   var dest = destination + "/js/" + fileName + ".min.js";
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
})

grunt.registerTask("wsTemplates", "Finds and prepares templates.", function() {
 grunt.file.expand(destination + "/_temp/compile/*").forEach(function (dir) {
  var dirName = dir.substr(dir.lastIndexOf('/')+1);
  grunt.config.set('concat.' + dirName, {
   src: [dir + '/**'],
   dest: destination + '/_temp/ractive/' + dirName + '.html'
 });
  grunt.task.run('concat:' + dirName)
});
});

grunt.registerTask("config", "Finds and prepares templates.", function() {
  var functions = grunt.file.expand(source + '/script/config/*.js');
  var options = {
    port : SERVER_PORT,
    host : APP_HOST,
    serv : REMOVE_SERVER,
    hosts : LIVE_HOST
  }
  var vars = "var options = " + JSON.stringify(options) + ";"
  var config = "var appConfig = { options: options";
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
      else
        obj = "var " + fileName + " = " + content + ";";
      vars += obj;
      config += "," + fileName + ":" + fileName;
    };
    config = vars + config + "};(function($){ window.appConfig = appConfig;})($);";
    grunt.file.write(destination + '/js/appConfig.js', config);
    console.log("Configuration file generated!");
  });

grunt.registerTask("wsSass", "Compile and process scss files", function(){
  var styles = grunt.file.expand(source + '/style/*');
  for (var i = 0; i < styles.length; i++) {
    var dir = styles[i];
    var dirName = dir.substr(dir.lastIndexOf('/')+1);
    if (dirName.indexOf(".") === -1){
      grunt.config.set('concat.' + dirName, {
        src: [dir + '/*.scss'],
        dest: destination + '/_temp/scss/' + dirName + '.scss'
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
      cwd: destination + '/_temp/scss',
      src: ['*.scss'],
      dest: destination + '/css',
      ext: '.min.css'
    }]
  })
  grunt.task.run('sass:' + dirName);
})

require('matchdep').filterDev('grunt-*','package.json').forEach(grunt.loadNpmTasks);
grunt.registerTask('prodCode', ['config', 'wsMinifyJS', 'clean:js']);
grunt.registerTask('ws', ['wsRactive', 'wsTemplates', 'wsReplace'])
grunt.registerTask('ractive', ['copy:index', 'ws']);
grunt.registerTask('prod', ['copy', 'wsSass', 'ractive', 'prodCode', 'wsWatch', 'cssmin', 'cleanBuild']);
grunt.registerTask('default', ['prod', 'connect', 'watch']);
grunt.registerTask('cleanBuild', ['clean:temp', 'clean:css', 'clean:js'])
grunt.registerTask('start', ['prod' ,'connect'])
};