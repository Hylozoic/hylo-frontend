var RichText = require('./services/RichText'),
  prettydate = require('pretty-date');

module.exports = function(angularModule) {
  angularModule
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
