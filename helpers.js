var format = require('util').format;

module.exports = {

  imageUrl: function(path) {
    return format('/img/%s', path);
  }

};