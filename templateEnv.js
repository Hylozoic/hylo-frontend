var format = require('util').format;

module.exports = function(env) {

  if (env === 'development') {
    process.env.BUNDLE_VERSION = 'dev';
  }

  var rootPath = format('%s/assets/%s',
    process.env.AWS_S3_CONTENT_URL,
    process.env.BUNDLE_VERSION);

  return {
    environment: env,
    rootPath: rootPath,
    imageUrl: function(path) {
      return format('%s/img/%s', rootPath, path);
    },
    assetUrl: function(path) {
      if (env !== 'development' && path.match(/bundle\.(js|css)/)) {
        path = path.replace(/\.(js|css)$/, '.min.$1');
      }
      return format('%s/%s', rootPath, path);
    }
  };

};
