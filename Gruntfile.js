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
      }
    },
    ngAnnotate: {
      prod: {
        files: {
          'dist/bundle.js': ['dist/bundle.js']
        }
      }
    },
    uglify: {
      prod: {
        options: {
          sourceMap: true
        },
        files: {
          'dist/bundle.min.js': ['dist/bundle.js']
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

  grunt.registerTask('package', ['browserify:dev', 'ngAnnotate:prod', 'uglify:prod', 'less:dev', 'cssmin:prod']);

  grunt.registerTask('deploy', function(env) {
    require('./deploy')(env, this.async(), grunt.log);
  });

  grunt.registerTask('clean', function() {
    rm('dist/*');
  })

};
