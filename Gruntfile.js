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
        dest: 'dist/bundle.js',
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
        tasks: ['browserify:dev'],
        options: {
          spawn: false
        }
      },
      css: {
        files: ['src/css/**/*'],
        tasks: ['less:dev']
      },
      html: {
        files: ['src/html/**/*'],
        tasks: ['sync:html']
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('bundle', ['browserify', 'ngtemplates', 'less']);
  grunt.registerTask('minify', ['ngAnnotate', 'uglify', 'cssmin']);
  grunt.registerTask('dev', ['bundle', 'serve', 'watch']);

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
