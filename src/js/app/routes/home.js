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
    views: {
      tab: /*@ngInject*/{
        template: 'my seeds',
        controller: function($scope) {

        }
      }
    }
  })
  .state('home.following', {
    url: '/h/following',
    views: {
      tab: /*@ngInject*/{
        template: 'following',
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