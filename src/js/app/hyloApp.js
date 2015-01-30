angular.module('hyloApp', [
  'ngRoute', 'ngResource', 'mgo-angular-wizard', 'ngAnimate', 'ngSanitize', 'ngIdle',
  'hyloServices', 'hyloDirectives', 'hyloFilters', 'hyloControllers', 'hyloRoutes',
  'angular-growl', 'http-auth-interceptor', 'hylo-auth-module', 'infinite-scroll', 'ngTouch',
  'ui.bootstrap', 'decipher.tags', 'monospaced.elastic', 'angular-bootstrap-select',
  'angular-bootstrap-select.extra', 'angulartics', 'angulartics.segment.io',
  'hylo.seeds', 'hylo.createCommunity', "hylo.menu", "mentio", "hylo.features", 'newrelic-timing'
])

.factory('$exceptionHandler', ['$log', function ($log) {
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
}])

.config(['$locationProvider', 'growlProvider', '$httpProvider', '$provide', '$idleProvider', '$tooltipProvider', '$urlRouterProvider',
  function($locationProvider, growlProvider, $httpProvider, $provide, $idleProvider, $tooltipProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);
    growlProvider.globalTimeToLive(5000);

    $idleProvider.idleDuration(45); // in seconds
    $idleProvider.warningDuration(1); // in seconds

    // remove trailing slashes from paths
    $urlRouterProvider.rule(require('./services/removeTrailingSlash'));

    // Disable bootstrap UI animations
    $tooltipProvider.options({
      animation: true
    });

    $provide.factory('myHttpInterceptor', ['$q', '$log', '$window', 'growl', function($q, $log, $window, growl) {
      return {
        'requestError': function(rejection) {
          return $q.reject(rejection);
        },

        'responseError': function(rejection) {
          var requestTo = rejection.config ? rejection.config.url : "N/A";
          if (rejection.status == 403) {
            Rollbar.error("Client 403 Error", {page: rejection.config.url});
            growl.addErrorMessage("Oops!  Something bad happened. The Hylo team has been notified.", {ttl: 5000});
          } else if (rejection.status == 500) {
            if (!hyloEnv.isProd) {
              if (rejection.headers()['content-type'] === "text/html") {
                $("body").html(rejection.data);
              } else {
                growl.addErrorMessage("DEBUG: 500 Internal Server Error.\nRoute: " + rejection.config.url, {ttl: 15000});
              }
              console.log(rejection, rejection.data);
            } else {
              growl.addErrorMessage("Oops! There was an error trying to perform your requested action. The Hylo team has been notified.", {ttl: 5000});
            }
          } else if (rejection.status == 404) {
            $log.error("404 ResponseError", rejection);
            Rollbar.error("Client 404 Error", {page: rejection.config.url});
            growl.addErrorMessage("Oops!  Something bad happened. The Hylo team has been notified.", {ttl: 5000});
          }
          return $q.reject(rejection);
        }
      };
    }]);

    $httpProvider.interceptors.push('myHttpInterceptor');

  }])

.run(['$rootScope', '$q', '$state', '$stateParams', 'Community', '$log', '$window', 'growl', 'MenuService', '$bodyClass',
  function($rootScope, $q, $state, $stateParams, Community, $log, $window, growl, MenuService, $bodyClass) {

    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error) {
        if (!hyloEnv.isProd) {
          console.error("$stateChangeError Occurred", event, toState, toParams, fromState, fromParams, error)
        } else {
          Rollbar.error("$stateChangeError Occurred", {
            toState: toState,
            toParams: toParams,
            fromState: fromState,
            fromParams: fromParams,
            error: error
          });
          growl.addErrorMessage("Oops! There was an error trying to perform your requested action. The Hylo team has been notified.", {ttl: 5000});
        }
      }
    );

    var bodyClass = require('./services/bodyClass');

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      MenuService.setMenuState(false, false);
      guiders.hideAll();

      // this is kind of a hack to get the new state's class on the body before
      // it's rendered. otherwise, directives that depend on having elements sized
      // correctly (ahem Medium.js) will get the wrong info.
      $rootScope.$bodyClass = bodyClass.extractClassNameFn(toState.name);
    });

    // Determines if we came into a page from within the app, or directly from the URL.  Useful for back button logic.
    // TODO change to a Service method.
    $rootScope.navigated = false;
    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
      if (from.name) { $rootScope.navigated = true; }
    });

    var currentSlug;

    //$stateParams is not set up yet at this point
    var locationMatchCommunity = window.location.toString().match(/c\/([^\/#\?]*)/);
    if (locationMatchCommunity != null) {
      currentSlug = locationMatchCommunity[1];
      $rootScope.community = Community.get({id: currentSlug});
    } else {
      $rootScope.community = Community.default();
    }

    // Set a variable so we can watch for param changes
    $rootScope.$state = $state;
    $rootScope.$bodyClass = $bodyClass;

    $rootScope.$watch("$state.params.community", function(slug) {
      if (angular.isDefined(slug) && slug != currentSlug) {
        $rootScope.community = Community.get({id: slug}, function(community) {
          $rootScope.community = community;
          currentSlug = slug;
        });
      }
    });

    // If there exists a growl message to display, then growl it.
    // Useful for displaying a growl message after storing it in the Play! flash scope.
    if ($window._hylo_angular_growl_msg && $window._hylo_angular_growl_msg != "") {
      _.defer(function() { growl.addSuccessMessage($window._hylo_angular_growl_msg, {ttl: 5000}) });
    }

  }]);
