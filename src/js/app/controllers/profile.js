var dependencies = ['$scope', '$analytics', '$stateParams', 'OldUser'];
dependencies.push(function($scope, $analytics, $stateParams, OldUser) {
	$scope.hello = 'on two lines';

  $scope.currentUser.$promise.then(function(user) {
    var isOwnProfile = (user.id == $stateParams.id);
    $analytics.eventTrack('User: Load a Member Profile', {user_id: user.id, is_own_profile: isOwnProfile});
    if (isOwnProfile) {
      $scope.user = user;
      $scope.editable = true;

    } else {
      $scope.user = OldUser.get({id: $stateParams.id});
      $scope.editable = false;
    }
    console.log("user: ");
    console.dir($scope.user);
  });


});

module.exports = function(angularModule) {
  angularModule.controller('ProfileCtrl', dependencies);
};