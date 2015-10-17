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
        templateUrl: '/ui/discover/communities.tpl.html',
        controller: function($scope, network, communities, currentUser) {
          'ngInject';
          $scope.communities = communities;
          $scope.network = network;
          $scope.currentUser = currentUser;

          $scope.askToJoin = function(communityId, userId) {
            console.log('User ' + userId + ' asks to join ' + communityId);
          }
        }
      }
    }
  })
};

