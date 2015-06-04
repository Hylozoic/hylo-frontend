
var routes = function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise(function($injector, $location){
    var state = $injector.get('$state');
    Rollbar.warning("404 Error: " + $location.path());
    state.go('notFound');
    return $location.path();
  });

  // handle old single-post links
  $urlRouterProvider.when('/c/:community/s/:seedId/comments', '/c/:community/s/:seedId');

  // handle old invitation links
  $urlRouterProvider.when('/community/invite/:token', '/h/use-invitation?token');

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
    .state('appEntry', /*@ngInject*/ {
      parent: 'main',
      url: '/app',
      onEnter: function(currentUser, $state, $timeout, onboarding) {
        var membership = (currentUser && currentUser.memberships[0]);
        if (membership) {
          $timeout(function() {
            $state.go('community.seeds', {community: membership.community.slug});
          });
        } else if (currentUser) {
          $timeout(function() {
            $state.go('home.allSeeds');
            Rollbar.error('User without community', {user_id: currentUser.id});
          });
        } else {
          $timeout(function() {
            $state.go('login');
          })
        }
      }
    })
    .state('loginSignup', {
      abstract: true,
      resolve: {
        loggedIn: function(User, $timeout, $state) {
          return User.status().$promise.then(function(res) {
            return res.signedIn;
          });
        },
        context: function() { return 'normal' },
        projectInvitation: function() { return null }
      },
      onEnter: function(loggedIn, $timeout, $state) {
        if (loggedIn) {
          $timeout(function() {
            $state.go('appEntry');
          });
        } else {
          window.hyloEnv.provideUser(null);
        }
      },
      template: '<div ui-view="loginSignup"></div>'
    })
    .state('login', {
      url: '/h/login?next',
      parent: 'loginSignup',
      views: {
        loginSignup: {
          templateUrl: '/ui/user/login.tpl.html',
          controller: 'LoginCtrl'
        }
      }
    })
    .state('signup', {
      url: '/h/signup?mode',
      parent: 'loginSignup',
      views: {
        loginSignup: {
          templateUrl: '/ui/user/signup.tpl.html',
          controller: 'SignupCtrl'
        }
      }
    })
    .state('forgotPassword', {
      url: '/h/forgot-password',
      parent: 'loginSignup',
      views: {
        loginSignup: {
          templateUrl: '/ui/user/forgot-password.tpl.html',
          controller: 'ForgotPasswordCtrl'
        }
      }
    })
    .state('useInvitation', /*@ngInject*/{
      url: '/h/use-invitation?token',
      templateUrl: '/ui/user/use-invitation.tpl.html',
      controller: function($scope, Invitation, $stateParams, $state) {
        Invitation.use({token: $stateParams.token}, function(resp) {
          if (resp.error) {
            $scope.error = resp.error;
          } else if (resp.signup) {
            Invitation.store(resp);
            $state.go('signup');
          } else {
            $state.go('appEntry');
          }
        });
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
    .state('network', {
      url: "/n/:slug",
      parent: 'main',
      resolve: {
        network: /*@ngInject*/ function(Network, $stateParams) {
          return Network.get({id: $stateParams.slug}).$promise;
        }
      },
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
    })
    .state('newSeed', {
      url: '/h/new-seed',
      parent: 'main',
      views: {
        main: {
          templateUrl: '/ui/seeds/edit.tpl.html',
          controller: 'SeedEditCtrl'
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

};

module.exports = function (angularModule) {
  angularModule.config(routes);
};