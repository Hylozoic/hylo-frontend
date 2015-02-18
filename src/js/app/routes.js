var communityStates = function(stateProvider) {
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
    url: '/create/community',
    parent: 'main',
    views: {
      "main": {
        templateUrl: '/ui/community/createCommunity.tpl.html',
        controller: 'CreateCommunityCtrl'
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

var profileStates = function(stateProvider) {
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
      },
      posts: function(user) {
        return user.seeds().$promise;
      }
    },
    views: {
      'main': {
        templateUrl: '/ui/profile/base.tpl.html',
        controller: 'ProfileCtrl'
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
}

var dependencies = ['$stateProvider', '$urlRouterProvider'];
dependencies.push(function($stateProvider, $urlRouterProvider) {

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
      template: "<div ui-view='main'></div>",
      resolve: {
        oldCurrentUser: function(CurrentUser) {
          return CurrentUser.get().$promise;
        },
        // user info has to be fetched from the new API for editing on
        // the new profile. eventually the old CurrentUser will be replaced
        // with this one.
        currentUser: function(User) {
          var promise = User.current().$promise;
          promise.then(function(user) {
            window.hyloEnv.provideUser(user);
          });
          return promise;
        }
      },
      controller: function($rootScope, oldCurrentUser, $stateParams) {
        $rootScope.currentUser = oldCurrentUser;
      }
    })
    .state('home', /*@ngInject*/ {
      url: '/app',
      resolve: {
        defaultCommunity: function(Community) {
          return Community.default().$promise;
        }
      },
      onEnter: function(defaultCommunity, $state) {
        if (defaultCommunity.slug)
          $state.go('community.seeds', {community: defaultCommunity.slug});
        else
          window.location = '/invitecode';
      }
    })
    .state('userSettings', {
      url: '/settings',
      parent: 'main',
      views: {
        "main": {
          templateUrl: '/ui/user/settings.tpl.html',
          controller: 'UserSettingsCtrl'
        }
      }
    })
    .state('network', {
      url: "/n/:network",
      views: {
        "": {
          templateUrl: '/ui/app/network.tpl.html',
          controller: 'NetworkCtrl'
        }
      }
    });

    communityStates($stateProvider);
    profileStates($stateProvider);

});

module.exports = dependencies;