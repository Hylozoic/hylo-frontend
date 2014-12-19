var async = require('async'),
  _ = require('lodash');

var fs = require('fs');
var request = require('request');

require('shelljs/global');

var _command = function(cmd) {
  return exec(cmd, {silent: true}).output.replace(/\n/, '');
};

var currentGitHash = function() {
  return _command("git show|head -n1|awk '{print $2}'|cut -c -8");
};

var currentGitSha = function() {
  return _command("git show|head -n1|awk '{print $2}'");
};

var gitUser = function() {
  return _command("git config user.email")
};

var Deployer = function(app, done, log) {
  this.app = app;
  this.done = done;
  this.bundleExts = ['js', 'css'];
  this.bundlePaths = {};
  this.log = log;
  this.version = currentGitHash();
  this.gitSha = currentGitSha();
  this.gitUser = gitUser();

  if (!process.env.HEROKU_API_TOKEN) {
    this.log.errorlns("HEROKU_API_TOKEN is not set");
  }
  var heroku = new (require('heroku-client'))({token: process.env.HEROKU_API_TOKEN});
  this.herokuConfig = heroku.apps(app).configVars();
};

Deployer.prototype.fail = function(err) {
  this.log.errorlns(err);
  this.done(false);
};

Deployer.prototype.getAWSKeys = function(callback) {
  this.log.subhead('fetching AWS credentials for ' + this.app);

  this.herokuConfig.info(function(err, vars) {
    this.herokuEnv = _.pick(vars,
      'AWS_ACCESS_KEY', 'AWS_SECRET_KEY', 'AWS_S3_BUCKET',
      'AWS_S3_CONTENT_URL', 'CONTENT_URL', 'ROLLBAR_SERVER_TOKEN',
      'DOMAIN', 'APPLICATION_ENV');
    callback(err);

    this.awsContentUrlPrefix = this.herokuEnv.AWS_S3_CONTENT_URL + '/';
  }.bind(this));
};

Deployer.prototype.upload = function(done) {
  this.log.subhead('uploading to S3');

  var s3 = new (require('aws-sdk')).S3({
    accessKeyId: this.herokuEnv.AWS_ACCESS_KEY,
    secretAccessKey: this.herokuEnv.AWS_SECRET_KEY
  });

  var upload = function(path, contents, type, done) {
    this.log.writeln(path);

    s3.putObject({
      Bucket: this.herokuEnv.AWS_S3_BUCKET,
      Key: path,
      Body: contents,
      ACL: 'public-read',
      ContentType: type
    }, done);
  }.bind(this);

  async.series([
    function js(done) {
      var contents = cat('dist/bundle.min.js'),
        path = 'assets/bundle-' + this.version + '.min.js';
      this.bundlePaths.js = path;

      contents = contents.replace(
        'sourceMappingURL=bundle.min.js.map',
        'sourceMappingURL=bundle-' + this.version + '.min.js.map'
      );

      upload(path, contents, 'application/x-javascript', done);
    }.bind(this),

    function jsMap(done) {
      var contents = cat('dist/bundle.min.js.map'),
        path = this.bundlePaths.js + '.map';

      upload(path, contents, 'application/json', done);
    }.bind(this),

    function css(done) {
      var contents = cat('dist/bundle.min.css'),
        path = 'assets/bundle-' + this.version + '.min.css';
      this.bundlePaths.css = path;

      // fix image paths
      contents = contents.replace(
        /url\((['"])*\//g,
        'url($1' + this.herokuEnv.CONTENT_URL + '/'
      );

      upload(path, contents, 'text/css', done);
    }.bind(this)
  ], done);

};

Deployer.prototype.uploadSourceMap = function(callback) {
  this.log.subhead('uploading source map');

  var formData = {
    // Pass a simple key-value pair
    access_token: this.herokuEnv.ROLLBAR_SERVER_TOKEN,
    // Pass data via Buffers
    version: this.version,
    minified_url: this.awsContentUrlPrefix + this.bundlePaths.js,
    // Pass optional meta-data with an 'options' object with style: {value: DATA, options: OPTIONS}
    // See the `form-data` README for more information about options: https://github.com/felixge/node-form-data
    source_map: {
      value:  fs.createReadStream('dist/bundle.min.js.map'),
      options: {
        filename: 'dist/bundle.min.js.map',
        contentType: 'application/octet-stream'
      }
    }
  };
  request.post({url:'https://api.rollbar.com/api/1/sourcemap',
        formData: formData},
        function optionalCallback(err, httpResponse, body) {
          if (err || body.err > 0) {
            console.error('upload failed:', err);
            this.fail(result.message);
          }
          console.log('Upload successful!  Rollbar responded with:', body);
          callback();
        }.bind(this)
  );
};

Deployer.prototype.notifyRollbar = function(callback) {
  this.log.subhead('Notifying Rollbar of deploy');

  var formData = {
    // Pass a simple key-value pair
    access_token: this.herokuEnv.ROLLBAR_SERVER_TOKEN,
    // Pass data via Buffers
    revision: this.gitSha,
    environment: this.herokuEnv.APPLICATION_ENV,
    local_username: this.gitUser
  };
  request.post({url:'https://api.rollbar.com/api/1/deploy/',
      formData: formData},
    function optionalCallback(err, httpResponse, body) {
      if (err || body.err > 0) {
        console.error('notify rollbar failed:', err);
        this.fail(result.message);
      }
      console.log('Rollbar notified successfuly!');
      callback();
    }.bind(this)
  );
};

Deployer.prototype.updateEnv = function(callback) {
  this.log.subhead('updating ENV on ' + this.app);

    newVars = {
      JS_BUNDLE_URL: this.awsContentUrlPrefix + this.bundlePaths.js,
      CSS_BUNDLE_URL: this.awsContentUrlPrefix + this.bundlePaths.css,
      BUNDLE_VERSION: this.version
    };

  _.forIn(newVars, function(val, key) {
    this.log.writeln(key + ': ' + val);
  }.bind(this));

  this.herokuConfig.update(newVars, callback);
};

module.exports = function(app, done, log) {
  var deployer = new Deployer(app, done, log);

  async.series([
    deployer.getAWSKeys.bind(deployer),
    deployer.upload.bind(deployer),
    deployer.uploadSourceMap.bind(deployer),
    deployer.notifyRollbar.bind(deployer),
    deployer.updateEnv.bind(deployer)
  ], function(err) {
    if (err) {
      deployer.fail(err);
    } else {
      done();
    }
  });
};
