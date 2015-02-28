var format = require('util').format;

var interceptor = function ($httpProvider, $provide) {

  $provide.factory('myHttpInterceptor', function ($q, $log, $window, growl) {
    return {
      requestError: function(rejection) {
        return $q.reject(rejection);
      },

      responseError: function(rejection) {
        Rollbar.error(format('%s: %s', rejection.status, rejection.config.url));
        var message = format('Oops! An error occurred. The Hylo team has been notified. (%s)', rejection.status);
        growl.addErrorMessage(message, {ttl: 5000});
        return $q.reject(rejection);
      }
    };
  });

  $httpProvider.interceptors.push('myHttpInterceptor');

};

module.exports = function (angularModule) {
  angularModule.config(interceptor);
};