var linkify = require('html-linkify'),
  marked = require('marked'),
  truncate = require('html-truncate');

marked.setOptions({
  gfm: true,
  breaks: true,
  sanitize: true
});

module.exports = {
  present: function(text, opts) {
    if (!opts) opts = {};
    if (!text) return '<p></p>';

    // wrap in a <p> tag
    if (!opts.skipWrap && text.substring(0, 3) != '<p>')
      text = format('<p>%s</p>', text);

    // make links
    text = linkify(text, {escape: false, attributes: {target: '_blank'}});

    // link hashtags
    // this is not ideal because it hardcodes the search path
    text = text.replace(/( |^)#(\w+)/g, '$1<a href="/h/search?q=%23$2">#$2</a>');

    if (opts.maxlength)
      text = truncate(text, opts.maxlength);

    return text;
  },

  markdown: function(text, opts) {
    var text = marked(text);
    if (opts && opts.maxlength) {
      text = truncate(text, opts.maxlength);
    }
    return text;
  }
};