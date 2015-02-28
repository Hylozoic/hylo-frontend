require('./auth_module');
require('./filters');
require('./directives');
require('./directives/embeddedComments');
require('./features/features');
require('./controllers');
require('./services');

var app = angular.module('hyloApp', [
  'ngRoute', 'ngResource', 'ngAnimate', 'ngSanitize', 'ngIdle',
  'hyloServices', 'hyloDirectives', 'hyloFilters', 'hyloControllers', 'ui.router',
  'angular-growl', 'http-auth-interceptor', 'hylo-auth-module', 'infinite-scroll', 'ngTouch',
  'ui.bootstrap', 'decipher.tags', 'monospaced.elastic', 'angular-bootstrap-select',
  'angular-bootstrap-select.extra', 'angulartics', 'angulartics.segment.io',
  'hylo.createCommunity', "hylo.menu", "mentio", "hylo.features", 'newrelic-timing'
]);

require('./routes')(app);
require('./animations')(app);
require('./services/removeTrailingSlash')(app);
require('./services/myHttpInterceptor')(app);

app.factory('$exceptionHandler', function ($log) {
  return function (exception, cause) {
    // Pass off the error to the default error handler
    // on the AngularJS logger. This will output the
    // error to the console (and let the application
    // keep running normally for the user).
    $log.error.apply($log, arguments);

    if (hyloEnv.isProd) {
      try {
        Rollbar.error(exception);
      } catch (loggingError) {
        // For Developers - log the log-failure.
        $log.warn("Error logging failed");
        $log.log(loggingError);
      }
    }
  };
});

app.config(function ($locationProvider, growlProvider, $idleProvider, $tooltipProvider) {
  $locationProvider.html5Mode(true);
  growlProvider.globalTimeToLive(5000);

  $idleProvider.idleDuration(45); // in seconds
  $idleProvider.warningDuration(1); // in seconds

  $tooltipProvider.options({animation: true});
});

app.run(function($rootScope, $q, $state, $stateParams, Community, $log, $window, growl, MenuService, $bodyClass) {

  $rootScope.$on('$stateChangeError',
    function(event, toState, toParams, fromState, fromParams, error) {
      if (!hyloEnv.isProd) {
        console.error("$stateChangeError", event, toState, toParams, fromState, fromParams, error);
      } else {
        Rollbar.error("$stateChangeError", {
          toState: toState,
          toParams: toParams,
          fromState: fromState,
          fromParams: fromParams,
          error: error
        });
        growl.addErrorMessage("Oops! An error occurred. The Hylo team has been notified. (SCE)", {ttl: 5000});
      }
    }
  );

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    MenuService.setMenuState(false, false);
  });

  // Determines if we came into a page from within the app, or directly from the URL.  Useful for back button logic.
  // TODO change to a Service method.
  $rootScope.navigated = false;
  $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
    if (from.name) { $rootScope.navigated = true; }

    if (!$rootScope.community) {
      $rootScope.community = Community.default();
    }
  });

  // Set a variable so we can watch for param changes
  $rootScope.$state = $state;
  $rootScope.$bodyClass = $bodyClass;

});
