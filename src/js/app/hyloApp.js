require('./directives');
require('./controllers');
require('./services');

var dependencies = [
  'angular-growl',
  'angulartics',
  'angulartics.segment.io',
  'hyloControllers',
  'hyloDirectives',
  'hyloServices',
  'infinite-scroll',
  'mentio',
  'newrelic-timing',
  'ngAnimate',
  'ngIdle',
  'ngResource',
  'ngSanitize',
  'ngTagsInput',
  'ngTouch',
  'ui.bootstrap',
  'ui.router'
];

if (hyloEnv.environment == 'test') {
  dependencies.push('ngMock');
  dependencies.push('ngMockE2E');
  dependencies.push('ngAnimateMock');
}

var app = angular.module('hyloApp', dependencies);

require('./routes')(app);
require('./animations')(app);
require('./filters')(app);
require('./features/mentions/userMentions')(app);
require('./services/removeTrailingSlash')(app);
require('./services/myHttpInterceptor')(app);

app.config(function ($locationProvider, growlProvider, $idleProvider) {
  $locationProvider.html5Mode(true);
  growlProvider.globalTimeToLive(5000);

  $idleProvider.idleDuration(45); // in seconds
  $idleProvider.warningDuration(1); // in seconds
});

app.run(function($rootScope, $state, Community, growl, $bodyClass, clickthroughTracker) {

  clickthroughTracker.track(location);

  $rootScope.$on('$stateChangeError',
    function(event, toState, toParams, fromState, fromParams, error) {
      if (error && _.include([401, 403], error.status)) {
        $state.go('login', {next: format('%s%s', window.location.pathname, window.location.search)});
        return;
      }

      // the part of the code that caused this should be prepared to
      // handle it (e.g. login attempt with invalid password)
      if (error && error.status == 422) {
        return;
      }

      if (!hyloEnv.isProd) {
        console.error('$stateChangeError en route to ' + toState.name);
        console.error(error);
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

  $rootScope.$state = $state;
  $rootScope.$bodyClass = $bodyClass;
});
