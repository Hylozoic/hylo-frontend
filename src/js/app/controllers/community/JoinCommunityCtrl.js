module.exports = function($scope, Community) {
  'ngInject';

  $scope.validateCode = _.debounce(function() {
    if (_.isEmpty($scope.code)) {
      $scope.isCodeValid = false;
      return;
    }

    Community.validate({
      column: 'beta_access_code',
      constraint: 'exists',
      value: $scope.code
    }, function(resp) {
      if (resp.exists) {
        $scope.isCodeValid = true;
      } else {
        $scope.isCodeValid = false;
      }
    });
  }, 250);

  $scope.submit = function() {
    if (!$scope.isCodeValid) return;

    Community.join({code: $scope.code}, function(resp) {
      $scope.$state.reload();
      if ($scope.$close) {
        $scope.$close(resp);
      }
    });
  };

};