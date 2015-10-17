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
      communities: /*@ngInject*/ function(Community) {
        return Community.search().$promise;
      }
    },
    views: {
      main: {
        templateUrl: '/ui/discover/communities.tpl.html',
        controller: function($scope, communities, currentUser) {
          'ngInject';
          $scope.communities = communities;
          $scope.currentUser = currentUser;
          $scope.canJoin = true;

          $scope.askToJoin = function(communityId, userId) {
            console.log('User ' + userId + ' asks to join ' + communityId);
          }
        }
      }
    }
  })
};

