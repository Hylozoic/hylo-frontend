
var routes = function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise(function($injector, $location){
    var state = $injector.get('$state');
    Rollbar.warning("404 Error: " + $location.path());
    state.go('404');
    return $location.path();
  });

  // handle old single-post links
  $urlRouterProvider.when('/c/:community/s/:seedId/comments', '/c/:community/s/:seedId');

  // handle alternate name of starting route
  $urlRouterProvider.when('/', '/app');

  $stateProvider
    .state("404", {
      templateUrl: '/ui/app/404.tpl.html'
    })
    .state('main', /*@ngInject*/ {
      abstract: true,
      templateUrl: '/ui/shared/main.tpl.html',
      resolve: {
        currentUser: function(User) {
          return User.current().$promise;
        },
        onboarding: function(currentUser, Onboarding) {
          var onboardingData = (currentUser && currentUser.onboarding);
          if (!_.any(onboardingData)) return null;
          return new Onboarding(currentUser);
        }
      },
      onEnter: function(currentUser) {
        window.hyloEnv.provideUser(currentUser);
      },
      controller: function($scope, $rootScope, currentUser, onboarding) {
        $rootScope.currentUser = currentUser;

        if (onboarding && !onboarding.isComplete())
          onboarding.resume();
      }
    })
    .state('appEntry', /*@ngInject*/ {
      parent: 'main',
      url: '/app',
      onEnter: function(currentUser, $state, $timeout, onboarding) {
        if (onboarding && !onboarding.isComplete())
          return;

        var membership = (currentUser && currentUser.memberships[0]);
        if (membership) {
          $timeout(function() {
            $state.go('community.seeds', {community: membership.community.slug});
          });
        } else {
          window.location = '/invitecode';
        }
      }
    })
    .state('userSettings', {
      url: '/settings',
      parent: 'main',
      views: {
        main: {
          templateUrl: '/ui/user/settings.tpl.html',
          controller: 'UserSettingsCtrl'
        }
      }
    })
    .state('network', {
      url: "/n/:network",
      parent: 'main',
      views: {
        main: {
          templateUrl: '/ui/app/network.tpl.html',
          controller: 'NetworkCtrl'
        }
      }
    })
    .state('support', {
      url: '/h/support',
      parent: 'main',
      views: {
        main: {
          templateUrl: '/ui/support/base.tpl.html',
          controller: function() {}
        }
      }
    })
    .state('notifications', {
      url: '/h/notifications',
      parent: 'main',
      views: {
        main: {
          templateUrl: '/ui/user/notifications.tpl.html',
          controller: 'NotificationsCtrl'
        }
      },
      resolve: {
        activity: function(Activity) {
          return Activity.query({limit: 50}).$promise;
        }
      }
    })
    .state('search', {
      url: "/h/search?q&c",
      parent: 'main',
      resolve: /*@ngInject*/ {
        initialQuery: function($stateParams) {
          return $stateParams.q;
        },
        searchCommunity: function($stateParams, Community) {
          if ($stateParams.c)
            return Community.get({id: $stateParams.c}).$promise;
        }
      },
      views: {
        main: {
          templateUrl: '/ui/app/search.tpl.html',
          controller: 'SearchCtrl'
        }
      }
    });

    require('./routes/community')($stateProvider);
    require('./routes/profile')($stateProvider);
    require('./routes/onboarding')($stateProvider);
    require('./routes/home')($stateProvider);

};

module.exports = function (angularModule) {
  angularModule.config(routes);
};