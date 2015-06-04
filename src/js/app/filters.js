var RichText = require('./services/RichText'),
  prettydate = require('pretty-date');

module.exports = function(angularModule) {
  angularModule
  .filter('markdown', function($filter) {
    return function(text) {
      return $filter('unsafe')(RichText.markdown(text));
    }
  })
  .filter('richText', function() {
    return function(text) {
      return RichText.present(text, {skipWrap: true});
    }
  })
  .filter('firstName', function() {
    return function(name) {
      return name.split(' ')[0];
    }
  })
  .filter('fromNow', function() {
    return function(dateStr) {
      return prettydate.format(new Date(dateStr));
    }
  });
};
