module.exports = function($stateProvider) {
  $stateProvider
  .state('discover', {
    url: "/discover",
    parent: 'main',
    abstract: true,
    resolve: {
      network: /*@ngInject*/ function(Network) {
        return Network.get({id: 'testing'}).$promise;
      }
    },
    views: {
      main: {
        templateUrl: '/ui/app/discover.tpl.html',
        controller: function($scope, network) {
          'ngInject';
          $scope.network = network;

          // temporary workaround
          var body = angular.element(document.querySelector('body'));
          body.addClass('network');
          body.addClass('network-communities');
        }
      }
    }
  })
  .state('discover.communities', {
    url: '/communities',
    resolve: {
      communities: /*@ngInject*/ function(Community) {
        return Community.search().$promise;
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/network/communities.tpl.html',
        controller: function($scope, communities) {
          'ngInject';
          $scope.communities = communities;
        }
      }
    }
  })
};

