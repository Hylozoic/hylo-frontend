module.exports = function($scope, $modal, $timeout) {
  'ngInject';

  $scope.joinCommunity = function() {
    $modal.open({
      templateUrl: '/ui/shared/join-community.tpl.html',
      controller: 'JoinCommunityCtrl'
    }).result.then(function(community) {
      $timeout(function() {
        $scope.$state.go('community.posts', {community: community.slug});
      });
    });
  };

};