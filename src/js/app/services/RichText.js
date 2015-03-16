var linkify = require('html-linkify'),
  format = require('util').format,
  truncate = require('html-truncate');

module.exports = {
  present: function(text, opts) {
    if (!text) return '<p></p>';

    // wrap in a <p> tag
    if (!opts.skipWrap && text.substring(0, 3) != '<p>')
      text = format('<p>%s</p>', text);

    // make links
    text = linkify(text, {escape: false, attributes: {target: '_blank'}});

    // link hashtags
    text = text.replace(/([^\w]|^)#(\w+)/g, format('$1<a href="/h/search?c=%s&q=%23$2">#$2</a>', opts.communityId));

    if (opts.maxlength)
      text = truncate(text, maxlength);

    return text;
  }
};