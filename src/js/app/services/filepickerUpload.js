var path = require('path');

/*
 * options:
 *   path:     the S3 folder under which the file will be saved
 *   convert:  image conversion settings (see filepicker docs)
 *   success:  a success callback, which receives the new file's url as an argument
 *   failure:  a failure callback, which receives the error as an argument
 *
 */
module.exports = function(opts) {
  var pickOptions = {
    mimetype: 'image/*',
    multiple: false,
    services: ['COMPUTER', 'FACEBOOK', 'WEBCAM', 'GOOGLE_DRIVE', 'DROPBOX', 'INSTAGRAM', 'FLICKR', 'URL'],
    folders: false
  };

  var storeOptions = {
    location: 'S3',
    container: hyloEnv.s3.bucket,
    path: 'orig/',
    access: 'public'
  };

  var convert = function(blobs) {
    var blob = blobs[0],
      // trim the old path "orig/" and replace spaces
      filename = blob.key.substring(5).replace(/ /g, '_'),
      convertStoreOptions = _.extend(storeOptions, {
        path: path.join(opts.path, filename)
      });

    filepicker.convert(blob, opts.convert, convertStoreOptions, function(newBlob) {
      opts.success(hyloEnv.s3.cloudfrontHost + '/' + newBlob.key);
    }, opts.failure)
  };

  filepicker.pickAndStore(pickOptions, storeOptions, convert, opts.failure);
};
