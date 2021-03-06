module.exports = function ($stateProvider) {
  $stateProvider
  .state('onboarding', {
    abstract: true,
    parent: 'main',
    views: {
      main: {
        template: "<div ui-view='onboarding'></div>"
      },
    },
  })
  .state('onboarding.start', {
    url: '/h/onboarding/start',
    resolve: {
      onboardingInit: function(onboarding) {
        'ngInject';
        return onboarding.init();
      }
    },
    views: {
      onboarding: {
        templateUrl: '/ui/onboarding/start.tpl.html',
        controller: /*@ngInject*/ function(onboarding, $scope) {
          $scope.onboarding = onboarding;
          onboarding.setStep('start');
        }
      }
    }
  })
  .state('onboarding.seeds', {
    url: '/h/onboarding/seeds',
    views: {
      onboarding: {
        templateUrl: '/ui/onboarding/seeds.tpl.html',
        controller: /*@ngInject*/ function(onboarding, $scope) {
          $scope.onboarding = onboarding;
        }
      }
    }
  });
};
