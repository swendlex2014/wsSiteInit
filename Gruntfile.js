module.exports = function(grunt) {

 var modRewrite = require('connect-modrewrite');
 var config = require('./src/wsGrunt/config');

    // Display the execution time when tasks are run:
    require('time-grunt')(grunt);
    // Initialize Grunt
    require('./src/wsGrunt/tasks/init')(grunt, config, modRewrite);

    grunt.registerTask("wsWatch", function() {
      require('./src/wsGrunt/tasks/wsWatch')(grunt, config);
    });

    grunt.registerTask("wsRactive", function() {
      require('./src/wsGrunt/tasks/wsRactive')(grunt, config);
    });

    grunt.registerTask("wsReplace", function() {
      require('./src/wsGrunt/tasks/wsReplace')(grunt, config);
    });

    grunt.registerTask("wsMinifyJS", function() {
      require('./src/wsGrunt/tasks/wsMinifyJS')(grunt, config);
    });

    grunt.registerTask("wsTemplates", function() {
      require('./src/wsGrunt/tasks/wsTemplates')(grunt, config);
    });

    grunt.registerTask("cleanVendor", function() {
      require('./src/wsGrunt/tasks/cleanVendor')(grunt, config);
    });

    grunt.registerTask("appConfig", function() {
      require('./src/wsGrunt/tasks/appConfig')(grunt, config);
    });

    grunt.registerTask("wsSass", function() {
      require('./src/wsGrunt/tasks/wsSass')(grunt, config);
    });

    grunt.registerTask("createTask", function() {
      require('./src/wsGrunt/tasks/createTask')(grunt, config);
    });


    require('matchdep').filterDev('grunt-*','package.json').forEach(grunt.loadNpmTasks);
    grunt.registerTask('prodCode', ['appConfig', 'wsMinifyJS', 'clean:js']);
    grunt.registerTask('ws', ['wsRactive', 'wsTemplates', 'wsReplace']);
    grunt.registerTask('ractive', ['copy:index', 'ws']);
    grunt.registerTask('prod0', ['copy', 'wsSass', 'ractive', 'prodCode', 'wsWatch', 'cssmin']);
    grunt.registerTask('prod', ['copy', 'wsSass', 'ractive', 'prodCode', 'wsWatch', 'cssmin', 'cleanAll']);
    grunt.registerTask('cleanAll', ['cleanVendor', 'clean:temp', 'clean:css', 'clean:js']);
    grunt.registerTask('default', ['prod', 'connect', 'watch']);
    grunt.registerTask('start', ['prod' ,'connect'])
  };