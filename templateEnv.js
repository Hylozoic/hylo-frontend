var format = require('util').format;

module.exports = function(env) {

  if (env == 'development') {
    return {
      environment: 'development',
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
    imageUrl: function(path) {
      return format('%s/assets/%s/img/%s', host, version, path);
    },
    assetUrl: function(path) {
      if (path.match(/bundle\.(js|css)/)) {
        path = path.replace(/\.(js|css)$/, '.min.$1');
      }
      return format('%s/assets/%s/%s', host, version, path);
    },
    rootPath: format('%s/assets/%s/', host, version)
  };

};
