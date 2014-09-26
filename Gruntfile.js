module.exports = function(grunt) {

  grunt.registerTask('serve', function() {
    require('./server')(3001, 'localhost', 9000);
  });

  grunt.registerTask('deploy', ['browserify:prod', 'less:dev', 'cssmin:prod', 'todo']);

  grunt.registerTask('todo', function() {
    grunt.log.ok('todo: append hash, deploy to S3, update heroku variables');
  });

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

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

};
