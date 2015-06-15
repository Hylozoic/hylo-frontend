module.exports = function ($stateProvider) {
  $stateProvider
  .state('community', {
    abstract: true,
    url: '/c/:community',
    parent: 'main',
    views: {
      main: {
        template: "<div ui-view='community'></div>"
      },
    },
    resolve: /*@ngInject*/ {
      community: function(Community, $stateParams, $rootScope) {
        return Community.get({id: $stateParams.community}).$promise;
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
  .state('community.posts', {
    url: '',
    parent: 'community.home',
    views: {
      tab: {
        templateUrl: '/ui/community/posts.tpl.html',
        controller: 'CommunityPostsCtrl'
      }
    },
    resolve: /*@ngInject*/ {
      firstPostQuery: function(community, Post, Cache) {
        var key = 'community.posts:' + community.id,
          cached = Cache.get(key);

        if (cached) {
          return cached;
        } else {
          return Post.queryForCommunity({
            communityId: community.id,
            limit: 10
          }).$promise.then(function(resp) {
            Cache.set(key, resp, {maxAge: 10 * 60});
            return resp;
          });
        }
      },
      showOverlay: function(onboarding) {
        // hack -- this is only here so it shows before the controller's other content appears
        if (onboarding && onboarding.currentStep() === 'community') {
          onboarding.showOverlay('community');
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
        controller: function($scope, community, currentUser) {
          'ngInject';
          $scope.community = community;
          $scope.canModerate = community.canModerate || currentUser.is_admin;
        }
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
      users: function(community, Cache) {
        var key = 'community.members:' + community.id,
          cached = Cache.get(key);

        if (cached) {
          return cached;
        } else {
          return community.members({
            with: ['skills', 'organizations'],
            limit: 20
          }).$promise.then(function(resp) {
            Cache.set(key, resp, {maxAge: 10 * 60});
            return resp;
          });
        }
      }
    }
  })
  .state('community.projects', {
    url: '/projects',
    parent: 'community.home',
    resolve: {
      projects: /*@ngInject*/ function(community) {
        return community.projects().$promise;
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/community/projects.tpl.html',
        controller: function($scope, projects) {
          'ngInject';
          $scope.projects = projects;
        }
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
  .state('community.newPost', {
    url: '/new-seed',
    views: {
      community: {
        templateUrl: '/ui/post/edit.tpl.html',
        controller: 'PostEditCtrl'
      }
    },
    resolve: {
      post: function() { return null; }
    }
  })
  .state('community.editPost', {
    url: '/s/:postId/edit',
    views: {
      community: {
        templateUrl: '/ui/post/edit.tpl.html',
        controller: 'PostEditCtrl'
      }
    },
    resolve: {
      post: ['Post', '$stateParams', function(Post, $stateParams) {
        return Post.get({id: $stateParams.postId}).$promise;
      }]
    }
  })
  .state('post', {
    url: '/s/:postId?action',
    parent: 'community',
    views: {
      community: {
        templateUrl: '/ui/post/show.tpl.html',
        controller: 'PostCtrl'
      }
    },
    resolve: {
      post: ['Post', '$stateParams', function(Post, $stateParams) {
        return Post.get({id: $stateParams.postId}).$promise;
      }]
    },
    data: {
      singlePost: true
    }
  });
};
