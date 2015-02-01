var linkify = require('html-linkify');

module.exports = {
  present: function(rawText) {
    return linkify(rawText, {escape: false, attributes: {target: '_blank'}});
  }
};