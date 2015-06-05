var format = require('util').format;

module.exports = function(env) {

  if (env == 'development') {
    return {
      environment: 'development',
      cssBundleUrl: '/bundle.css',
      jsBundleUrl: '/bundle.js',
      imageUrl: function(path) {
        return format('/dev/img/%s', path);
      },
      assetUrl: function(path) {
        return format('/dev/%s', path);
      },
      rootPath: '/dev/'
    };
  }

  var host = process.env.AWS_S3_CONTENT_URL,
    version = process.env.BUNDLE_VERSION;

  return {
    environment: env,
    cssBundleUrl: format('%s/assets/bundle-%s.min.css', host, version),
    jsBundleUrl: format('%s/assets/bundle-%s.min.js', host, version),
    imageUrl: function(path) {
      return format('%s/assets/%s/img/%s', host, version, path);
    },
    assetUrl: function(path) {
      return format('%s/assets/%s/%s', host, version, path);
    },
    rootPath: format('%s/assets/%s/', host, version)
  };

};
