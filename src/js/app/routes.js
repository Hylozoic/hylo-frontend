
var routes = function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise(function($injector, $location){
    var state = $injector.get('$state');
    Rollbar.warning("404 Error: " + $location.path());
    state.go('notFound');
    return $location.path();
  });

  // handle old links
  $urlRouterProvider.when('/c/:community/s/:postId/comments', '/c/:community/s/:postId');
  $urlRouterProvider.when('/community/invite/:token', '/use-invitation?token');
  $urlRouterProvider.when('/h/login', '/login');
  $urlRouterProvider.when('/h/signup', '/signup');
  $urlRouterProvider.when('/h/search', '/search');

  // handle alternate name of starting route
  $urlRouterProvider.when('/', '/app');

  $stateProvider
    .state('notFound', {
      templateUrl: '/ui/app/404.tpl.html'
    })
    .state('main', /*@ngInject*/ {
      abstract: true,
      templateUrl: '/ui/shared/main.tpl.html',
      resolve: {
        currentUser: function(User) {
          return User.loadCurrent();
        },
        onboarding: function(currentUser, Onboarding) {
          var onboardingData = (currentUser && currentUser.onboarding);
          if (!_.any(onboardingData)) return null;
          return new Onboarding(currentUser);
        }
      }
    })
    .state('userSettings', {
      url: '/settings?expand',
      parent: 'main',
      views: {
        main: {
          templateUrl: '/ui/user/settings.tpl.html',
          controller: 'UserSettingsCtrl'
        }
      }
    })
    .state('support', {
      url: '/h/support',
      parent: 'main',
      views: {
        main: {
          templateUrl: '/ui/support/base.tpl.html',
          controller: function($anchorScroll) {
            $anchorScroll();
          }
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
      url: "/search?q&c",
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
    })
    .state('newPost', {
      url: '/h/new-seed',
      parent: 'main',
      views: {
        main: {
          templateUrl: '/ui/post/edit.tpl.html',
          controller: 'PostEditCtrl'
        }
      },
      resolve: {
        seed: function() { return null; },
        community: function() { return null; }
      }
    });

    require('./routes/community')($stateProvider);
    require('./routes/profile')($stateProvider);
    require('./routes/onboarding')($stateProvider);
    require('./routes/home')($stateProvider);
    require('./routes/project')($stateProvider);
    require('./routes/network')($stateProvider);
    require('./routes/entrance')($stateProvider);

};

module.exports = function (angularModule) {
  angularModule.config(routes);
};