module.exports = function(angularModule) {

  angularModule.controller("CommunitySettingsCtrl", [
    "$scope", '$timeout', '$state', '$log', '$analytics', 'Community',
    function ($scope, $timeout, $state, $log, $analytics, Community) {

      $scope.close = function() {
        $state.go('community', {community: $scope.community.slug});
      };

      $scope.submit = function() {
        if ($scope.submitting) return;
        $scope.submitting = true;

        Community.invite({id: $scope.community.id, emails: $scope.emails})
        .$promise.then(function(resp) {
          if (resp.sent > 1)
            alert('Your invitations are on their way!');
          else
            alert('Your invitation is on its way!');
          $scope.emails = '';
          $scope.submitting = false;
        }, function() {
          alert('Something went wrong. Please check the emails you entered for typos.');
          $scope.submitting = false;
        });
      };

    }
  ]);

};