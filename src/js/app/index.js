require('./directives');
require('./controllers');
require('./services');

var dependencies = [
  'afkl.lazyImage',
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

app.run(function($anchorScroll) {
  $anchorScroll.yOffset = 54; // = @nav-height in nav.less
  $anchorScroll();
});

app.run(function(clickthroughTracker) {
  clickthroughTracker.track(location);
});

app.run(function($rootScope, $state, growl, $bodyClass) {

  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    if (error && _.include([401, 403], error.status)) {
      if ($rootScope.currentUser) {
        growl.addErrorMessage("You don't have permission to view that.");
      } else {
        $state.go('login', {next: format('%s%s', window.location.pathname, window.location.search)});
      }
      return;
    }

    // the part of the code that caused this should be prepared to
    // handle it (e.g. login attempt with invalid password)
    if (error && error.status == 422) {
      return;
    }

    if (error === 'login required') {
      // see e.g. routes/home.js
      return;
    }
  });

  $rootScope.$state = $state;
  $rootScope.$bodyClass = $bodyClass;

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, error) {
    if (fromState.name == "") {
      
      function connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
          callback(WebViewJavascriptBridge)
        } else {
          document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge)
          }, false)
        }
      };

      connectWebViewJavascriptBridge(function(bridge) {
        
        /* Init your app here */

        bridge.init(function(message, responseCallback) {

          // currently does not do anything with messages from app

        });

        bridge.send("loaded");
        
      });
    };
  });
});
