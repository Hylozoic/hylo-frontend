module.exports = function ($stateProvider) {

  $stateProvider
  .state('home', {
    abstract: true,
    parent: 'main',
    views: {
      main: {
        templateUrl: '/ui/home/show.tpl.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('home.mySeeds', {
    url: '/h/my-seeds',
    resolve: /*@ngInject*/{
      firstPostQuery: function(UserCache, currentUser) {
        return UserCache.posts.fetch(currentUser.id);
      },
      user: function(currentUser) {
        return currentUser;
      },
      isSelf: function() { return true }
    },
    views: {
      tab: {
        templateUrl: '/ui/home/my-seeds.tpl.html',
        controller: 'SeedListCtrl'
      }
    }
  })
  .state('home.following', {
    url: '/h/following',
    resolve: /*@ngInject*/{
      firstPostQuery: function(UserCache, currentUser) {
        return UserCache.followedPosts.fetch(currentUser);
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/home/following-seeds.tpl.html',
        controller: 'FollowedSeedsCtrl'
      }
    }
  })
  .state('home.allSeeds', {
    url: '/h/all-seeds',
    resolve: /*@ngInject*/{
      firstPostQuery: function(UserCache, currentUser) {
        return UserCache.allPosts.fetch(currentUser);
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/home/all-seeds.tpl.html',
        controller: 'AllSeedsCtrl'
      }
    }
  })
  .state('home.projects', /*@ngInject*/ {
    url: '/h/my-projects',
    resolve: {
      projects: function(currentUser) {
        return currentUser.projects().$promise;
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/home/projects.tpl.html',
        controller: function($scope, projects) {
          $scope.projects = projects;
        }
      }
    }
  });

};