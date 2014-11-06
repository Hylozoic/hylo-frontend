angular.module("hyloControllers").controller('NetworkCtrl', ['$scope', '$stateParams',
  function($scope, $stateParams) {
    $scope.requested = $stateParams.network;
    $scope.name = "Some Other Network";
  }]);