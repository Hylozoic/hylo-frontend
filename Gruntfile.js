require('dotenv').load();

var deploy = require('./deploy'),
  _ = require('lodash'),
  format = require('util').format;

module.exports = function(grunt) {

  grunt.initConfig({
    less: {
      dev: {
        files: {
          'dist/dev/bundle.css': ['src/css/index.less'],
          'dist/dev/admin/bundle.css': ['src/css/admin/index.less'],
          'dist/dev/styleguide/bundle.css': ['src/css/styleguide.less'],
          'dist/dev/subscribe/bundle.css': ['src/css/subscribe.less']
        }
      },
      deploy: {
        files: {
          'dist/deploy/pages/bundle.css': ['src/css/index.less'],
          'dist/deploy/pages/admin/bundle.css': ['src/css/admin/index.less'],
          'dist/deploy/pages/styleguide/bundle.css': ['src/css/styleguide.less'],
          'dist/deploy/pages/subscribe/bundle.css': ['src/css/subscribe.less']
        }
      }
    },
    cssmin: {
      deploy: {
        files: {
          'dist/deploy/pages/bundle.min.css': ['dist/deploy/pages/bundle.css'],
          'dist/deploy/pages/admin/bundle.min.css': ['dist/deploy/pages/admin/bundle.css'],
          'dist/deploy/pages/styleguide/bundle.min.css': ['dist/deploy/pages/styleguide/bundle.css'],
          'dist/deploy/pages/subscribe/bundle.min.css': ['dist/deploy/pages/subscribe/bundle.css']
        }
      }
    },
    browserify: {
      options: {
        browserifyOptions: {
          debug: true
        },
        transform: ['browserify-ngannotate', 'debowerify']
      },
      dev: {
        files: {
          'dist/dev/bundle.js': ['src/js/index.js'],
          'dist/dev/admin/bundle.js': ['src/js/admin/index.js'],
          'dist/dev/subscribe/bundle.js': ['src/js/subscribe/index.js']
        },
        options: {
          watch: true
        }
      },
      deploy: {
        files: {
          'dist/deploy/pages/bundle.js': ['src/js/index.js'],
          'dist/deploy/pages/admin/bundle.js': ['src/js/admin/index.js'],
          'dist/deploy/pages/subscribe/bundle.js': ['src/js/subscribe/index.js']
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
          'dist/deploy/pages': ['dist/deploy/pages/bundle.js'],
          'dist/deploy/pages/admin': ['dist/deploy/pages/admin/bundle.js']
        }
      }
    },
    uglify: {
      deploy: {
        options: {
          sourceMap: true,
          sourceMapIn: 'dist/deploy/pages/bundle.js.map',
          sourceMapIncludeSources: true
        },
        files: {
          'dist/deploy/pages/bundle.min.js': ['dist/deploy/pages/bundle.js'],
          'dist/deploy/pages/admin/bundle.min.js': ['dist/deploy/pages/admin/bundle.js']
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
      }
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
        dest: 'dist/deploy/pages/bundle.js',
        options: {
          append: true,
          module: 'hyloApp',
          prefix: '/ui'
        }
      }
    },
    watch: {
      js: {
        files: ['dist/dev/**/*.js']
      },
      css: {
        files: ['src/css/**/*'],
        tasks: ['less:dev', 'notify:css']
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
        files: ['src/html/ui/**/*.ejs', 'src/html/ui-partials/**/*.ejs'],
        tasks: ['ejs:ui']
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

  grunt.registerTask('dev-start', [
    'browserify:dev',
    'less:dev',
    'sync:img',
    'sync:ui',
    'ejs:pages',
    'ejs:ui'
  ]);

  grunt.registerTask('dev', [
    'dev-start',
    'serve',
    'watch'
  ]);

  grunt.registerTask('serve', function() {
    require('./server')({
      log: grunt.log,
      port: parseInt(grunt.option('port') || 1337)
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
