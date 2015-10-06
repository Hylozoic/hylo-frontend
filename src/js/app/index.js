var connectWebViewJavascriptBridge = require('./services/webViewJavascriptBridge')
var isiOSApp = require('./services/isIOSApp')
var isAndroidApp = require('./services/isAndroidApp')
var branch = require('../../../node_modules/branch-sdk')

require('./directives')
require('./controllers')

var dependencies = [
  'afkl.lazyImage',
  'angular-growl',
  'angulartics',
  'angulartics.segment.io',
  'hyloControllers',
  'hyloDirectives',
  'infinite-scroll',
  'mentio',
  'newrelic-timing',
  'ngAnimate',
  'ngResource',
  'ngSanitize',
  'ngTagsInput',
  // 'ngTouch',
  'ui.bootstrap',
  'ui.bootstrap.datetimepicker',
  'ui.router'
]

if (window.hyloEnv.environment === 'test') {
  dependencies.push('ngMock')
  dependencies.push('ngMockE2E')
  dependencies.push('ngAnimateMock')
}

var app = angular.module('hyloApp', dependencies)

require('./routes')(app)
require('./animations')(app)
require('./filters')(app)
require('./services')(app)

app.config(function ($locationProvider, growlProvider) {
  $locationProvider.html5Mode(true)
  growlProvider.globalTimeToLive(5000)
})

app.run(function ($anchorScroll) {
  $anchorScroll.yOffset = 54 // = @nav-height in nav.less
  $anchorScroll()
})

app.run(function (clickthroughTracker) {
  clickthroughTracker.track(window.location)
})

app.run(function ($rootScope, $state, growl, $bodyClass, CurrentUser) {
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    if (error && _.include([401, 403], error.status)) {
      if (CurrentUser.isLoggedIn()) {
        growl.addErrorMessage("You don't have permission to view that.")
      } else {
        $state.go('login', {next: format('%s%s', window.location.pathname, window.location.search)})
      }
      return
    }

    // the part of the code that caused this should be prepared to
    // handle it (e.g. login attempt with invalid password)
    if (error && error.status === 422) {
      return
    }

    if (error === 'login required') {
      // see e.g. routes/home.js
      return
    }
  })

  $rootScope.$state = $state
  $rootScope.$bodyClass = $bodyClass

  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, error) {
    if (typeof AndroidBridge !== 'undefined') {
      var payload = {message: 'stateChanged', toState: toState.name}
      AndroidBridge.send(JSON.stringify(payload))
    } else if (isiOSApp()) {
      if (fromState.name === '') {
        connectWebViewJavascriptBridge(function (bridge) {
          bridge.init(function (message, responseCallback) {
            // currently does not do anything with messages from app
          })

          var payload = {message: 'loaded'}
          bridge.send(JSON.stringify(payload))
        })
      }

      connectWebViewJavascriptBridge(function (bridge) {
        var payload = {message: 'stateChanged', toState: toState.name}
        bridge.send(JSON.stringify(payload))
      })
    }
  })

  $rootScope.$on('$viewContentLoaded', function () {
    if (!isiOSApp() && !isAndroidApp()) {
      branch.init(window.hyloEnv.branch.key)
      branch.banner(
        {
          icon: '/img/appicon.png',
          title: 'Hylo App',
          description: 'The Hylo App!',
          forgetHide: 10,
          mobileSticky: true,
          showDesktop: false
        },
        {}
      )
    }
  })
})
