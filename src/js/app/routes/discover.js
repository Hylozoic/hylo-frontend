module.exports = function($stateProvider) {
  $stateProvider
  .state('discover', {
    url: "/discover",
    parent: 'main',
    abstract: true
  })
  .state('discover.communities', {
    url: '/discover/communities',
    parent: 'main',
    resolve: {
      network: /*@ngInject*/ function(Network) {
        return Network.get({id: 'testing'}).$promise;
      },
      communities: /*@ngInject*/ function(Community) {
        return Community.search().$promise;
      }
    },
    views: {
      main: {
        templateUrl: '/ui/network/communities.tpl.html',
        controller: function($scope, network, communities) {
          'ngInject';
          $scope.communities = communities;
          $scope.network = network;

          // temporary workaround
          var body = angular.element(document.querySelector('body'));
          body.addClass('network');
          body.addClass('network-communities');
        }
      }
    }
  })
};

