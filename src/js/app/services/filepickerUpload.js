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
      convertStoreOptions = $.extend(storeOptions, {path: opts.path + blob.key.substring(5)});

    filepicker.convert(blob, opts.convert, convertStoreOptions, function(newBlob) {
      opts.success(hyloEnv.s3.cloudfrontHost + '/' + newBlob.key);
    }, opts.failure)
  };

  filepicker.pickAndStore(pickOptions, storeOptions, convert, opts.failure);
};
