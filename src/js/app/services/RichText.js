var linkify = require('html-linkify'),
  format = require('util').format;

module.exports = {
  present: function(rawText, communitySlug) {
    var text = linkify(rawText, {escape: false, attributes: {target: '_blank'}});
    // link hashtags
    return text.replace(/([^\w]|^)#(\w+)/g, format('$1<a href="/c/%s/search?q=%23$2">#$2</a>', communitySlug));
  }
};