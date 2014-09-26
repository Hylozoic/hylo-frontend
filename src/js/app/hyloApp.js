angular.module('hyloApp', [
  'ngRoute', 'ngResource', 'mgo-angular-wizard', 'ngAnimate', 'ngSanitize', 'ngIdle',
  'hyloServices', 'hyloDirectives', 'hyloFilters', 'hyloControllers', 'hyloRoutes',
  'angular-growl', 'http-auth-interceptor', 'hylo-auth-module', 'infinite-scroll', 'ngTouch',
  'ui.bootstrap', 'decipher.tags', 'monospaced.elastic', 'angular-bootstrap-select', 'angular-bootstrap-select.extra',
  'angulartics', 'angulartics.segment.io',
  'hylo.billing', 'hylo.seeds'
])

.factory('$exceptionHandler', ['$log', function ($log) {
  return function (exception, cause) {
    // Pass off the error to the default error handler
    // on the AngualrJS logger. This will output the
    // error to the console (and let the application
    // keep running normally for the user).
    $log.error.apply( $log, arguments );

    try {
      if (!window.DEBUG) {
        Rollbar.error("Client-Error", exception);
      }
    } catch ( loggingError ) {
      // For Developers - log the log-failure.
      $log.warn( "Error logging failed" );
      $log.log( loggingError );
    }
  };
}])

.config(['$locationProvider', 'growlProvider', '$httpProvider', '$provide', '$idleProvider', '$tooltipProvider',
  function($locationProvider, growlProvider, $httpProvider, $provide, $idleProvider, $tooltipProvider) {
    $locationProvider.html5Mode(true);
    growlProvider.globalTimeToLive(5000);

    $idleProvider.idleDuration(45); // in seconds
    $idleProvider.warningDuration(1); // in seconds

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
          var requestTo = rejection.config ? rejection.config.url : "N/A"
          if (rejection.status == 403) {
//            $window.location.replace(jsRoutes.controllers.Application.show403(requestTo).absoluteURL());
            $log.error(rejection)
            if (window.DEBUG) {
              $log.error("403 ERROR", requestTo);
            } else {
              $("body").load(jsRoutes.controllers.Application.show403(requestTo).absoluteURL() + " #mainContainer");
            }
          } else if (rejection.status == 500) {
            if (window.DEBUG) {
              $("body").html(rejection.data);
            } else {
              growl.addErrorMessage("Oops! There was an error trying to perform your requested action.  Authorities have been notified!", {ttl: 5000});
//              $window.location.replace(jsRoutes.controllers.Application.show500().absoluteURL());
            }
          } else if (rejection.status == 404) {
//            $window.location.replace(jsRoutes.controllers.Application.show404(requestTo).absoluteURL());
            $log.error(rejection)
            if (window.DEBUG) {
              $log.error("404 ERROR", requestTo);
            } else {
              $("body").load(jsRoutes.controllers.Application.show404(requestTo).absoluteURL() + " #mainContainer");
            }
          }
          return $q.reject(rejection);
        }
      };
    }]);

    $httpProvider.interceptors.push('myHttpInterceptor');

  }])

.run(['CurrentUser', '$rootScope', '$q', '$state', '$stateParams', 'CurrentCommunity', '$log', '$window', 'growl',
  function(CurrentUser, $rootScope, $q, $state, $stateParams, CurrentCommunity, $log, $window, growl) {

    $rootScope.currentUser = CurrentUser.get();

    //$stateParams is not set up yet at this point
    var currentCommunitySlug = window.location.toString().match(/c\/([^\/#\?]*)/)[1];

    $rootScope.community = CurrentCommunity.get({slug: currentCommunitySlug});

    // Set a variable so we can watch for param changes
    $rootScope.watchingState = $state;

    $rootScope.$watch("watchingState.params.community", function(slug) {
      if (angular.isDefined(slug) && slug != currentCommunitySlug) {
        CurrentCommunity.get({slug: slug}, function(community) {
          $rootScope.community = community;
          currentCommunitySlug = slug;
        });
      }
    });

    // If there exists a growl message to display, then growl it.
    if ($window._hylo_angular_growl_msg && $window._hylo_angular_growl_msg != "") {
      _.defer(function() { growl.addSuccessMessage($window._hylo_angular_growl_msg, {ttl: 5000}) });
    }

    // Set filepicker key
    filepicker.setKey('AaCSLBryuRwutbBybERE8z');

    // Hide all tour guiders on transition change.
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      guiders.hideAll();
    });
  }]);
