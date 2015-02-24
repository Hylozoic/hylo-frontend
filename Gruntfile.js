require('dotenv').load();

var deploy = require('./deploy'),
  _ = require('lodash'),
  format = require('util').format;

module.exports = function(grunt) {

  grunt.initConfig({
    less: {
      dev: {
        files: {
          'dist/bundle.css': ['src/css/index.less']
        },
        options: {
          rootpath: "/dev/"
        }
      },
      deploy: {
        files: {
          'dist/deploy/bundle.css': ['src/css/index.less']
        }
      },
      styleguide: {
        files: {
          'dist/styleguide.css': ['src/css/styleguide.less']
        }
      }
    },
    cssmin: {
      deploy: {
        files: {
          'dist/deploy/bundle.min.css': ['dist/deploy/bundle.css']
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
      },
      deploy: {
        options: {
          browserifyOptions: {
            debug: true
          },
          transform: ['debowerify']
        },
        files: {
          'dist/deploy/bundle.js': ['src/js/index.js']
        }
      }
    },
    ejs: {
      pages: {
        options: require('./templateEnv')('development'),
        files: [
          {expand: true, cwd: 'src/html/pages', src: ['**/!(_)*.ejs'], dest: 'dist/dev', ext: '.html'}
        ]
      },
      ui: {
        options: require('./templateEnv')('development'),
        files: [
          {expand: true, cwd: 'src/html/ui', src: ['**/!(_)*.ejs'], dest: 'dist/ui', ext: '.tpl.html'}
        ]
      },
      deploy: {
        files: [
          {expand: true, cwd: 'src/html/pages', src: ['**/!(_)*.ejs'], dest: 'dist/deploy/pages', ext: '.html'},
          {expand: true, cwd: 'src/html/ui', src: ['**/!(_)*.ejs'], dest: 'dist/deploy/ui', ext: '.tpl.html'}
        ]
      }
    },
    extract_sourcemap: {
      deploy: {
        files: {
          'dist/deploy': ['dist/deploy/bundle.js']
        }
      }
    },
    ngAnnotate: {
      deploy: {
        files: {
          'dist/deploy/bundle-annotated.js': ['dist/deploy/bundle.js']
        }
      }
    },
    uglify: {
      deploy: {
        options: {
          sourceMap: true,
          sourceMapIn: 'dist/deploy/bundle.js.map',
          sourceMapIncludeSources: true
        },
        files: {
          'dist/deploy/bundle.min.js': ['dist/deploy/bundle-annotated.js']
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
      ui: {
        files: [
          {cwd: 'src/html/ui', src: ['**/*.html'], dest: 'dist/ui/'}
        ],
        verbose: true
      },
      styleguide: {
        files: [
          {cwd: 'src/html/styleguide', src: ['**'], dest: 'dist/styleguide'}
        ],
        updateAndDelete: true,
        verbose: true
      },
    },
    copy: {
      deploy: {
        files: [
          {expand: true, cwd: 'src/img', src: ['**'], dest: 'dist/deploy/pages/img/'},
          {expand: true, cwd: 'src/html/ui', src: ['**/*.html'], dest: 'dist/deploy/ui/'}
        ],
      }
    },
    ngtemplates: {
      deploy: {
        cwd: 'dist/deploy/ui',
        src: '**/*.html',
        dest: 'dist/deploy/bundle-annotated.js',
        options: {
          append: true,
          module: 'hyloApp',
          prefix: '/ui'
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
        tasks: ['sync:img']
      },
      pages: {
        files: ['src/html/pages/**/*'],
        tasks: ['ejs:pages']
      },
      ui: {
        files: ['src/html/ui/**/*.html'],
        tasks: ['sync:ui']
      },
      uiEjs: {
        files: ['src/html/ui/**/*.ejs'],
        tasks: ['ejs:ui']
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

  grunt.registerTask('dev', [
    'browserify:dev',
    'less:dev',
    'sync:img',
    'sync:ui',
    'ejs:pages',
    'ejs:ui',
    'sync:styleguide',
    'serve',
    'watch'
  ]);

  grunt.registerTask('serve', function() {
    require('./server')({
      log: grunt.log,
      port: parseInt(grunt.option('port') || 3001),
      upstream: grunt.option('upstream') || 'hylo-dev.herokuapp.com',
      nodeUpstream: grunt.option('node-upstream') || 'hylo-node-dev.herokuapp.com'
    });
  });

  grunt.registerTask('build', function() {
    var done = this.async(),
      target = grunt.option('to');

    deploy.setupEnv(target, grunt.log, function() {

      // delay the requiring of templateEnv until after env vars are loaded
      var templateEnv = require('./templateEnv')(target);

      grunt.config.merge({
        ejs: {
          deploy: {
            options: templateEnv
          }
        },
        less: {
          deploy: {
            options: {
              rootpath: templateEnv.rootPath
            }
          }
        }
      });

      _.each([
        'clean',
        'copy:deploy',
        'ejs:deploy',
        'browserify:deploy',
        'extract_sourcemap',
        'ngAnnotate',
        'ngtemplates',
        'uglify',
        'less:deploy',
        'cssmin'
      ], function(task) {
        grunt.task.run(task);
      });

      done();
    });
  });

  grunt.registerTask('deploy', ['build', 'upload']);

  grunt.registerTask('upload', function() {
    deploy.run(grunt.option('to'), this.async(), grunt.log);
  });

  grunt.registerTask('clean', function() {
    rm('-r', 'dist/*');
  });

};
