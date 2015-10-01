module.exports = function($scope, $modal, CurrentUser, joinCommunity) {
  'ngInject';

  $scope.currentUser = CurrentUser.get();

  $scope.joinCommunity = joinCommunity;

};
