module.exports = function($scope, Community, CurrentUser, $timeout, $analytics) {
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

    Community.join({code: $scope.code}, function(membership) {
      var community = membership.community;
      $analytics.eventTrack('Joined community', {id: community.id, slug: community.slug});

      if ($scope.$close) $scope.$close();

      var user = CurrentUser.get();
      if (!_.find(user.memberships, m => m.community_id === community.id))
        user.memberships.push(membership);

      $scope.$state.go('appEntry');
    });
  };

};
