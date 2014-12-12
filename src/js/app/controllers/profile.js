var dependencies = ['$scope', '$analytics', '$stateParams', 'User'];
dependencies.push(function($scope, $analytics, $stateParams, User) {
	$scope.hello = 'on two lines';

  $scope.currentUser.$promise.then(function(currentUser) {
    var isOwnProfile = (currentUser.id == $stateParams.id);
    $analytics.eventTrack('User: Load a Member Profile', {member_id: $stateParams.id, is_own_profile: isOwnProfile});
    if (isOwnProfile) {
      $scope.user = User.current();
      $scope.editable = true;

    } else {
      $scope.user = User.get({id: $stateParams.id});
      $scope.editable = false;
    }
    console.log("user: ");
    console.dir($scope.user);
  });


});

module.exports = function(angularModule) {
  angularModule.controller('ProfileCtrl', dependencies);
};