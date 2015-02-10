require('dotenv').load();

module.exports = function(grunt) {

  grunt.initConfig({
    less: {
      dev: {
        files: {
          'dist/bundle.css': ['src/css/index.less']
        }
      },
      styleguide: {
        files: {
          'dist/styleguide.css': ['src/css/styleguide.less']
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
    ejs: {
      dev: {
        options: require('./templateEnv')('development'),
        src: ['**/!(_)*.ejs'],
        cwd: 'src/html/pages',
        dest: 'dist/dev',
        expand: true,
        ext: '.html'
      },
      deploy: {
        options: require('./templateEnv')(grunt.option('to')),
        src: ['**/!(_)*.ejs'],
        cwd: 'src/html/pages',
        dest: 'dist/deploy',
        expand: true,
        ext: '.html'
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
      img: {
        files: [
          {cwd: 'src/img', src: ['**'], dest: 'dist/dev/img/'}
        ],
        updateAndDelete: true,
        verbose: true
      },
      imgDeploy: {
        files: [
          {cwd: 'src/img', src: ['**'], dest: 'dist/deploy/img/'}
        ],
        updateAndDelete: true,
        verbose: true
      },
      ui: {
        files: [
          {cwd: 'src/html/ui/', src: ['**'], dest: 'dist/ui/'}
        ],
        updateAndDelete: true,
        verbose: true
      },
      styleguide: {
        files: [
          {cwd: 'src/html/styleguide', src: ['**'], dest: 'dist/styleguide'}
        ],
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
      img: {
        files: ['src/img/**/*'],
        tasks: ['sync:imgDev']
      },
      pages: {
        files: ['src/html/pages/**/*'],
        tasks: ['ejs:dev']
      },
      ui: {
        files: ['src/html/ui/**/*'],
        tasks: ['sync:ui']
      },
      styleguide: {
        files: ['src/html/styleguide/**/*'],
        tasks: ['sync:styleguide']
      },
      options: {
        livereload: true,
        livereloadOnError: false
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
  grunt.registerTask('dev', ['browserify', 'less', 'ejs:dev', 'sync', 'serve', 'watch']);
  grunt.registerTask('deploy', ['ejs:deploy', 'sync:imgDeploy', 'upload']);

  grunt.registerTask('serve', function() {
    require('./server')({
      log: grunt.log,
      port: parseInt(grunt.option('port') || 3001),
      upstream: grunt.option('upstream') || 'hylo-dev.herokuapp.com',
      nodeUpstream: grunt.option('node-upstream') || 'hylo-node-dev.herokuapp.com'
    });
  });

  grunt.registerTask('upload', function() {
    var app;
    if (grunt.option('to') == 'staging') {
      app = 'hylo-staging';
    } else if (grunt.option('to') == 'production') {
      app = 'hylo';
    }
    require('./deploy')(app, this.async(), grunt.log);
  });

  grunt.registerTask('clean', function() {
    rm('-r', 'dist/*');
  });

};
