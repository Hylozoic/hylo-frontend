require('shelljs/global');

module.exports = function(grunt) {

  grunt.initConfig({
    less: {
      dev: {
        files: {
          'dist/bundle.css': ['src/css/index.less']
        }
      }
    },
    cssmin: {
      prod: {
        files: {
          'dist/bundle.min.css': ['dist/bundle.css']
        }
      }
    },
    browserify: {
      dev: {
        options: {
          transform: ['debowerify']
        },
        files: {
          'dist/bundle.js': ['src/js/index.js']
        }
      },
      prod: {
        options: {
          transform: ['debowerify', 'uglifyify']
        },
        files: {
          'dist/bundle.min.js': ['src/js/index.js']
        }
      }
    },
    copy: {
      index: {
        files: [
          {src: 'app/index.html', dest: 'dist/index.html'}
        ]
      }
    },
    watch: {
      js: {
        files: ['src/js/**/*'],
        tasks: ['browserify:dev'],
        options: {
          spawn: false
        }
      },
      css: {
        files: ['src/css/**/*'],
        tasks: ['less:dev']
      } //,
      // html: {
      //   files: ['app/index.html'],
      //   tasks: ['copy:index']
      // }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('dev', ['serve', 'watch']);

  grunt.registerTask('serve', function() {
    require('./server')(3001, 'hylo-dev.herokuapp.com', 80);
    // TODO parameterize upstream address and port
  });

  grunt.registerTask('package', ['browserify:prod', 'less:dev', 'cssmin:prod']);

  grunt.registerTask('deploy', function(env) {
    require('./deploy')(env, this.async(), grunt.log);
  });

};
