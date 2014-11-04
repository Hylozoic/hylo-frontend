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
          browserifyOptions: {
            debug: true
          },
          transform: ['debowerify']
        },
        files: {
          'dist/bundle.js': ['src/js/index.js']
        }
      }
    },
    extract_sourcemap: {
      prod: {
        files: {
          'dist': ['dist/bundle.js']
        }
      }
    },
    ngAnnotate: {
      prod: {
        files: {
          'dist/bundle-annotated.js': ['dist/bundle.js']
        }
      }
    },
    uglify: {
      prod: {
        options: {
          sourceMap: true,
          sourceMapIn: 'dist/bundle.js.map',
          sourceMapIncludeSources: true
        },
        files: {
          'dist/bundle.min.js': ['dist/bundle-annotated.js']
        }
      }
    },
    sync: {
      html: {
        cwd: 'src/html/ui',
        src: ['**'],
        dest: 'dist/ui',
        updateAndDelete: true,
        verbose: true
      }
    },
    ngtemplates: {
      dev: {
        cwd: 'src/html',
        src: '**/*.html',
        dest: 'dist/bundle-annotated.js',
        options: {
          append: true,
          module: 'hyloApp',
          prefix: '/'
        }
      }
    },
    watch: {
      js: {
        files: ['src/js/**/*'],
        tasks: ['browserify', 'notify:js'],
        options: {
          spawn: false
        }
      },
      css: {
        files: ['src/css/**/*'],
        tasks: ['less', 'notify:css']
      },
      html: {
        files: ['src/html/**/*'],
        tasks: ['sync:html']
      }
    },
    notify: {
      js: {
        options: {
          message: 'JS bundling done'
        }
      },
      css: {
        options: {
          message: 'CSS bundling done'
        }
      }
    },
    'node-inspector': {
      dev: {}
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('bundleJs', ['browserify', 'extract_sourcemap', 'ngAnnotate', 'ngtemplates', 'uglify']);
  grunt.registerTask('bundleCss', ['less', 'cssmin']);
  grunt.registerTask('bundle', ['bundleJs', 'bundleCss']);
  grunt.registerTask('dev', ['browserify', 'less', 'sync:html', 'serve', 'watch']);

  grunt.registerTask('serve', function() {
    require('./server')({
      log: grunt.log,
      port: parseInt(grunt.option('port') || 3001),
      upstream: grunt.option('upstream') || 'hylo-dev.herokuapp.com',
      nodeUpstream: grunt.option('node-upstream') || 'hylo-node-dev.herokuapp.com'
    });
  });

  grunt.registerTask('deploy', function(env) {
    require('./deploy')(env, this.async(), grunt.log);
  });

  grunt.registerTask('clean', function() {
    rm('-r', 'dist/*');
  });

};
