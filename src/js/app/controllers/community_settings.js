module.exports = function(angularModule) {

  angularModule.controller("CommunitySettingsCtrl", [
    "$scope", '$timeout', '$state', '$log', '$analytics', 'Community',
    function ($scope, $timeout, $state, $log, $analytics, Community) {

      $scope.close = function() {
        $state.go('community', {community: $scope.community.slug});
      };

      // TODO: add this when community editing is restored
      // $analytics.eventTrack('Community: Edited Community', {community_id: value.slug});

      $scope.invite = function() {
        if ($scope.submitting) return;
        $scope.submitting = true;
        $scope.inviteResults = null;

        Community.invite({id: $scope.community.id, emails: $scope.emails})
        .$promise.then(function(resp) {
          $scope.inviteResults = resp.results;
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