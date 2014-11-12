module.exports = function(angularModule) {

  angularModule.controller("CommunitySettingsCtrl", [
    "$scope", '$timeout', '$state', '$log', '$analytics',
    function ($scope, $timeout, $state, $log, $analytics) {

      $scope.close = function() {
        $state.go('community', {community: $scope.community.slug});
      };

      $scope.submit = function() {
        // TODO
      };

    }
  ]);

};