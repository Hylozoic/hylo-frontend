var path = require('path'),
  qs = require('querystring'),
  isiOSApp = require('./isIOSApp'),
  connectToBridge = require('./webViewJavascriptBridge')

// order matters, except for CONVERT, which toggles the crop UI
var services = [
  // 'CONVERT',
  'COMPUTER',
  'URL',
  'WEBCAM',
  'FACEBOOK',
  'INSTAGRAM',
  'DROPBOX',
  'GOOGLE_DRIVE'
]

var makeFilename = function (blob) {
  var extension = '',
    timestamp = new Date().getTime().toString()

  if (blob.filename) {
    return timestamp + '_' + blob.filename.replace(/[ %+\(\)]/g, '')
  }

  switch (blob.mimetype) {
    case 'image/png':  extension = '.png'
      break
    case 'image/jpeg': extension = '.jpg'
      break
    case 'image/gif':  extension = '.gif'
      break
  }
  return timestamp + extension
}

/*
 * options:
 *   path:     the S3 folder under which the file will be saved
 *   convert:  image conversion settings (see filepicker docs)
 *   success:  a success callback, which receives the new file's url as an argument
 *   failure:  a failure callback, which receives the error as an argument
 *
 */
module.exports = function (opts) {
  var convertAndStore = function (blob) {
    // apply additional context-specific conversion settings
    var conversion = _.extend({compress: true, quality: 90}, opts.convert)

    // blob.url will end with "/convert?crop=..."
    // if "CONVERT" is in the list of services
    var url = blob.url + '/convert?' + qs.stringify(conversion)

    filepicker.storeUrl(
      url,
      {
        access: 'public',
        container: hyloEnv.s3.bucket,
        location: 'S3',
        path: path.join(opts.path, makeFilename(blob))
      },
      stored => opts.success(hyloEnv.s3.cloudfrontHost + '/' + stored.key),
      opts.failure
    )
  }

  filepicker.setKey(hyloEnv.filepicker.key)

  if (typeof AndroidBridge !== 'undefined') {
    var resp = AndroidBridge.filepickerUpload(opts)
    resp === '' ? opts.failure('Cancelled') : convertAndStore(JSON.parse(resp))
  } else if (isiOSApp()) {
    var payload = JSON.stringify({message: 'filepickerUpload', options: opts})

    connectToBridge(bridge => bridge.send(payload, resp => (resp === '' ? opts.failure('Cancelled') : convertAndStore(JSON.parse(resp)))))

  } else {
    filepicker.pick(
      {
        mimetype: 'image/*',
        multple: false,
        services: services
      },
      convertAndStore,
      opts.failure
    )
  }

}
