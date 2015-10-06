module.exports = function($scope, $controller, community, code) {
  'ngInject';

  $scope.community = community;
  $scope.code = code;

  $controller('JoinCommunityCtrl', {$scope: $scope})
  // Validate the community join code from last part of the URL.
  $scope.validateCode();
};
