filepickerUpload = function(path, onSuccess, onFailure) {
  console.log('faking picture upload for path ' + path);
  onSuccess();
  // TODO
};

module.exports = function(angularModule) {

  angularModule.controller("CommunitySettingsCtrl", [
    "$scope", '$timeout', '$state', '$log', '$analytics', 'Community',
    function ($scope, $timeout, $state, $log, $analytics, Community) {

      $scope.close = function() {
        $state.go('community', {community: $scope.community.slug});
      };

      $scope.changeIcon = function() {
        filepickerUpload('communityIcon',
          function() {
            $analytics.eventTrack('Community: Changed Icon', {
              community_id: $scope.community.slug,
              moderator_id: $scope.currentUser.id
            });
          },
          function() {
            // error!
          })
      };

      $scope.changeBanner = function() {
        filepickerUpload('communityBanner',
          function() {
            $analytics.eventTrack('Community: Changed Banner', {
              community_id: $scope.community.slug,
              moderator_id: $scope.currentUser.id
            });
          },
          function() {
            // error!
          })
      };

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