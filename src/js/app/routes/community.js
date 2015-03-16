module.exports = function ($stateProvider) {
  $stateProvider
  .state('community', {
    abstract: true,
    url: '/c/:community',
    parent: 'main',
    views: {
      "main": {
        template: "<div ui-view='community'></div>"
      },
    },
    resolve: /*@ngInject*/ {
      community: function(Community, $stateParams, $rootScope) {
        var promise = Community.get({id: $stateParams.community}).$promise;
        promise.then(function(community) {
          $rootScope.community = community;
        });
        return promise;
      }
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
    },
    resolve: /*@ngInject*/ {
      firstSeedQuery: function(community, Seed, Cache) {
        var key = 'community.seeds:' + community.id,
          cached = Cache.get(key);

        if (cached) {
          return cached;
        } else {
          return Seed.queryForCommunity({
            communityId: community.id,
            limit: 10
          }).$promise.then(function(resp) {
            Cache.set(key, resp, {maxAge: 10 * 60});
            return resp;
          });
        }
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
    },
    resolve: /*@ngInject*/ {
      users: function(community) {
        return community.members({
          with: ['skills', 'organizations'],
          limit: 20
        }).$promise;
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
  });
};
