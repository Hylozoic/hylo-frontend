var format = require('util').format,
  version = require('./deploy/version')(8);

module.exports = function(env) {

  if (env == 'development') {
    return {
      environment: 'development',
      cssBundleUrl: '/bundle.css',
      jsBundleUrl: '/bundle.js',
      imageUrl: function(path) {
        return format('/dev/img/%s', path);
      }
    };
  }

  var host;
  if (env === 'staging') {
    host = process.env.STAGING_S3_CONTENT_HOST;
  } else if (env === 'production') {
    host = process.env.PRODUCTION_S3_CONTENT_HOST;
  }

  return {
    environment: env,
    cssBundleUrl: format('%s/assets/bundle-%s.min.css', host, version),
    jsBundleUrl: format('%s/assets/bundle-%s.min.js', host, version),
    imageUrl: function(path) {
      return format('%s/assets/%s/img/%s', host, version, path);
    }
  };

};
