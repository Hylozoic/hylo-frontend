var qs = require('querystring');

var service = function ($analytics) {
  return {
    track: function(location) {
      var params = qs.parse(location.search.replace(/^\?/, ''));
      if (!params.ctt) return;

      $analytics.eventTrack('Clickthrough', {type: params.ctt, id: params.cti});

      // remove the params to prevent double-counting events on page reload
      var newUrl = location.pathname,
        otherParams = _.omit(params, 'ctt', 'cti');

      if (_.any(otherParams)) {
        newUrl += '?' + qs.stringify(otherParams);
      }
      window.history.replaceState({}, 'Hylo', newUrl);
    }
  };
};

module.exports = function (angularModule) {
  angularModule.factory('clickthroughTracker', service);
}