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
        return UserCache.fetchSeeds(currentUser.id);
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
    views: {
      tab: /*@ngInject*/{
        templateUrl: '/ui/seeds/list.tpl.html',
        controller: function($scope) {

        }
      }
    }
  })
  .state('home.allSeeds', {
    url: '/h/all-seeds',
    views: {
      tab: /*@ngInject*/{
        template: 'all seeds',
        controller: function($scope) {

        }
      }
    }
  });

};