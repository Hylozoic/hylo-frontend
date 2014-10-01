require('shelljs/global');
var aws = require('aws-sdk'),
  sha1 = require('sha1'),
  _ = require('lodash');

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
    var done = this.async(), asyncCount = 2;

    // TODO grab AWS variables from Heroku

    var s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY
    });

    _.each(['js', 'css'], function(ext) {
      var path = 'dist/bundle.min.' + ext,
        contents = cat(path),
        digest = sha1(contents).substring(0, 8),
        bundlePath = 'assets/bundle-' + digest + '.min.' + ext;

      console.log('uploading to S3: ' + bundlePath);

      s3.putObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: bundlePath,
        Body: contents
      }, function(err, data) {
        if (err) {
          console.log('error uploading ' + bundlePath + ': ' + err);
          done(false);
        }

        asyncCount -= 1; // HMM are there race conditions here?
        if (asyncCount == 0) done();
      });

      // TODO update {JS,CSS}_BUNDLE_URL on Heroku
    });
  });

};
