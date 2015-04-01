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
    resolve: {
      firstSeedQuery: function(UserCache, currentUser) {
        return UserCache.seeds.fetch(currentUser.id);
      },
      user: function(currentUser) {
        return currentUser;
      },
      isSelf: function() { return true }
    },
    views: {
      tab: {
        templateUrl: '/ui/seeds/list.tpl.html',
        controller: 'SeedListCtrl'
      }
    }
  })
  .state('home.following', {
    url: '/h/following',
    resolve: {
      firstSeedQuery: function(UserCache, currentUser) {
        return UserCache.followedSeeds.fetch(currentUser);
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
    resolve: {
      firstSeedQuery: function(UserCache, currentUser) {
        return currentUser.allSeeds({limit: 10}).$promise;
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/home/all-seeds.tpl.html',
        controller: 'AllSeedsCtrl'
      }
    }
  });

};