var communityStates = function (stateProvider) {
  stateProvider
  .state('community', {
    abstract: true,
    url: '/c/:community',
    parent: 'main',
    views: {
      "main": {
        template: "<div ui-view='community'></div>"
      },
    },
    resolve: {
      community: ['Community', '$stateParams', '$rootScope', function(Community, $stateParams, $rootScope) {
        var promise = Community.get({id: $stateParams.community}).$promise;
        promise.then(function(community) {
          $rootScope.community = community;
        });
        return promise;
      }]
    }
  })
  .state('community.home', {
    abstract: true,
    parent: 'community',
    views: {
      community: {
        templateUrl: '/ui/community/base.tpl.html',
        controller: 'CommunityCtrl'
      }
    }
  })
  .state('community.seeds', {
    url: '',
    parent: 'community.home',
    views: {
      tab: {
        templateUrl: '/ui/community/seeds.tpl.html',
        controller: 'CommunitySeedsCtrl'
      }
    }
  })
  .state('community.about', {
    url: '/about',
    parent: 'community.home',
    views: {
      tab: {
        templateUrl: '/ui/community/about.tpl.html',
        controller: 'CommunityAboutCtrl'
      }
    }
  })
  .state('community.members', {
    url: '/members',
    parent: 'community.home',
    views: {
      tab: {
        templateUrl: '/ui/community/members.tpl.html',
        controller: 'CommunityMembersCtrl'
      }
    }
  })
  .state('createCommunity', {
    url: '/h/new-community',
    parent: 'main',
    views: {
      "main": {
        templateUrl: '/ui/community/create.tpl.html',
        controller: 'NewCommunityCtrl'
      }
    }
  })
  .state('community.settings', {
    url: '/settings',
    views: {
      community: {
        templateUrl: '/ui/community/settings.tpl.html',
        controller: 'CommunitySettingsCtrl'
      }
    }
  })
  .state('community.invite', {
    url: '/invite',
    views: {
      community: {
        templateUrl: '/ui/community/invite.tpl.html',
        controller: 'CommunityInviteCtrl'
      }
    }
  })
  .state('community.newSeed', {
    url: '/new-seed',
    views: {
      "community": {
        templateUrl: '/ui/seeds/edit.tpl.html',
        controller: 'SeedEditCtrl'
      }
    },
    resolve: {
      seed: function() { return null; }
    }
  })
  .state('community.editSeed', {
    url: '/s/:seedId/edit',
    views: {
      community: {
        templateUrl: '/ui/seeds/edit.tpl.html',
        controller: 'SeedEditCtrl'
      }
    },
    resolve: {
      seed: ['Seed', '$stateParams', function(Seed, $stateParams) {
        return Seed.get({id: $stateParams.seedId}).$promise;
      }]
    }
  })
  .state('seed', {
    url: '/s/:seedId',
    parent: 'community',
    views: {
      "community": {
        templateUrl: '/ui/seeds/show.tpl.html',
        controller: 'SeedCtrl'
      }
    },
    resolve: {
      seed: ['Seed', '$stateParams', function(Seed, $stateParams) {
        return Seed.get({id: $stateParams.seedId}).$promise;
      }]
    },
    data: {
      singlePost: true
    }
  })
  .state('community.search', {
    url: "/search?q",
    resolve: {
      query: ['$stateParams', function($stateParams) {
        return $stateParams.q;
      }]
    },
    views: {
      "community": {
        templateUrl: '/ui/app/search.tpl.html',
        controller: 'SearchCtrl'
      }
    }
  });

};

var profileStates = function (stateProvider) {
  stateProvider
  .state('profile', {
    parent: 'main',
    url: '/u/:id',
    resolve: /*@ngInject*/ {
      isSelf: function(currentUser, $stateParams) {
        return parseInt(currentUser.id) === parseInt($stateParams.id);
      },
      user: function(User, isSelf, $stateParams, currentUser) {
        if (isSelf) {
          return currentUser;
        } else {
          return User.get({id: $stateParams.id}).$promise;
        }
      }
    },
    views: {
      'main': {
        templateUrl: '/ui/profile/base.tpl.html',
        controller: 'ProfileCtrl'
      }
    }
  })
  .state('profile.seeds', {
    url: '/seeds',
    resolve: {
      posts: /*@ngInject*/ function(user) {
        return user.seeds().$promise;
      }
    },
    views: {
      'tab': {
        templateUrl: '/ui/profile/seeds.tpl.html',
        controller: 'ProfileSeedsCtrl'
      }
    }
  })
  .state('profile.contributions', {
    url: '/contributions',
    resolve: {
      contributions: ['user', function(user) {
        return user.contributions().$promise;
      }]
    },
    views: {
      'tab': {
        templateUrl: '/ui/profile/contributions.tpl.html',
        controller: 'ProfileContributionsCtrl'
      }
    }
  })
  .state('profile.thanks', {
    url: '/thanks',
    resolve: {
      thanks: ['user', function(user) {
        return user.thanks().$promise;
      }]
    },
    views: {
      'tab': {
        templateUrl: '/ui/profile/thanks.tpl.html',
        controller: 'ProfileThanksCtrl'
      }
    }
  })
  .state('editProfile', {
    url: '/edit-profile',
    parent: 'main',
    views: {
      'main': {
        templateUrl: '/ui/profile/edit.tpl.html',
        controller: 'ProfileEditCtrl'
      }
    }
  });
};

var onboardingStates = function (stateProvider) {
  stateProvider
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
    views: {
      onboarding: {
        templateUrl: '/ui/onboarding/start.tpl.html',
        controller: /*@ngInject*/ function(onboarding, $scope) {
          $scope.onboarding = onboarding;
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
  })
  .state('onboarding.seeds2', {
    url: '/h/onboarding/seeds/2',
    views: {
      onboarding: {
        templateUrl: '/ui/onboarding/seeds2.tpl.html',
        controller: /*@ngInject*/ function(onboarding, $scope) {
          $scope.onboarding = onboarding;
        }
      }
    }
  });
};

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
        oldCurrentUser: function(CurrentUser) {
          return CurrentUser.get().$promise;
        },
        // user info has to be fetched from the new API for editing on
        // the new profile. eventually the old CurrentUser will be replaced
        // with this one.
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
      controller: function($scope, $rootScope, oldCurrentUser, currentUser, onboarding, Menu) {
        $rootScope.currentUser = oldCurrentUser;

        if (onboarding && !onboarding.isComplete())
          onboarding.resume();

        $scope.menu = Menu;
        $scope.menu.user = currentUser;
      }
    })
    .state('home', /*@ngInject*/ {
      parent: 'main',
      url: '/app',
      onEnter: function(currentUser, $state) {
        var membership = (currentUser && currentUser.memberships[0]);
        if (membership) {
          $state.go('community.seeds', {community: membership.community.slug});
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
    });

    communityStates($stateProvider);
    profileStates($stateProvider);
    onboardingStates($stateProvider);

};

module.exports = function (angularModule) {
  angularModule.config(routes);
};