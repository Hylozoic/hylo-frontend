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
      ui: {
        cwd: 'src/html/ui',
        src: ['**'],
        dest: 'dist/ui',
        updateAndDelete: true,
        verbose: true
      },
      styleguide: {
        cwd: 'src/html/styleguide',
        src: ['**'],
        dest: 'dist/styleguide',
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
      ui: {
        files: ['src/html/ui/**/*'],
        tasks: ['sync:ui']
      },
      styleguide: {
        files: ['src/html/styleguide/**/*'],
        tasks: ['sync:styleguide']
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
  grunt.registerTask('dev', ['browserify', 'less', 'sync', 'serve', 'watch']);

  grunt.registerTask('serve', function() {
    var upstream = grunt.option('upstream');
    if (upstream) {
      upstream = upstream.split(':');
      host = upstream[0];
      port = parseInt(upstream[1] || '80');
    } else {
      host = 'hylo-dev.herokuapp.com';
      port = 80;
    }

    require('./server')(3001, host, port, grunt.log);
  });

  grunt.registerTask('deploy', function(env) {
    require('./deploy')(env, this.async(), grunt.log);
  });

  grunt.registerTask('clean', function() {
    rm('-r', 'dist/*');
  });

  grunt.registerTask('sync_old_repo', function() {
    var oldPath = '../hylo-play/';

    rm('-r', 'src/*');

    mkdir('src/css');
    cp('-R', oldPath + 'app/assets/stylesheets/*', 'src/css/');
    cp('-R', oldPath + 'public/stylesheets/*', 'src/css/');
    mv('src/css/global.less', 'src/css/index.less');
    sed('-i', '\.\./\.\./\.\./bower_components', 'bower_components', 'src/css/index.less');

    mkdir('src/js');
    cp('-R', oldPath + 'public/javascripts/*', 'src/js/');
    mv('src/js/init2.js', 'src/js/index.js');

    mkdir('src/html');
    cp('-R', oldPath + 'public/ui/*', 'src/html/');

    cp('-f', oldPath + 'bower.json', '.');
  });
};
