angular.module("hyloControllers").controller('UserSettingsCtrl', ['$scope', '$rootScope', 'growl', '$analytics', '$state',
  function($scope, $rootScope, growl, $analytics, $state) {

   console.log("loaded user settings");
   $analytics.eventTrack('Profile: User Settings: Opened User Settings');

   $scope.close = function() {
      //todo: direct to member profile page
      //$state.go('community', {community: $scope.community.slug});
    };

    $scope.editing = {};
    $scope.edited = {};

    $scope.edit = function(field) {
      $scope.edited[field] = $scope.community[field];
      $scope.editing[field] = true;
    };

    $scope.cancelEdit = function(field) {
      $scope.editing[field] = false;
    };

    $scope.saveEdit = function(field) {
      $scope.editing[field] = false;
      var data = {id: $scope.community.id};
      data[field] = $scope.edited[field];
      $analytics.eventTrack('Profile: User Settings: Updated a User Setting', {updated_setting: field});

      //save data via API
    };

  }]);
