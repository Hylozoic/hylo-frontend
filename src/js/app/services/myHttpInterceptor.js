var format = require('util').format;

var config = function ($httpProvider) {
  $httpProvider.interceptors.push(function ($q, growl) {
    return {
      responseError: function(rejection) {
        if (!_.include([401, 403, 422], rejection.status)) {
          Rollbar.error(format('%s: %s', rejection.status, rejection.config.url));
          var message = format('Oops! An error occurred. The Hylo team has been notified. (%s)', rejection.status);
          growl.addErrorMessage(message, {ttl: 5000});
        }

        return $q.reject(rejection);
      }
    };
  });
};

module.exports = function (angularModule) {
  angularModule.config(config);
};