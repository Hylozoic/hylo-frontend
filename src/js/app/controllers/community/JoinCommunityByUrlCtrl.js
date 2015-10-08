module.exports = function($scope, $controller, community, code, currentUser, $modal) {
  'ngInject';

  $scope.community = community;
  $scope.code = code;

  $scope.alreadyJoined = !!_.find(currentUser.memberships, m => m.community_id === community.id);

  // Put functions from JoinCommunityCtrl onto $scope.
  $controller('JoinCommunityCtrl', {$scope: $scope})

  // Validate the community join code from last part of the URL.
  $scope.validateCode();
}
