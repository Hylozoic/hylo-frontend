var dependencies = ['$scope', '$analytics', 'newCurrentUser'];
dependencies.push(function($scope, $analytics, newCurrentUser) {
  var user = $scope.user = newCurrentUser;

  $scope.editData = _.pick(user, ['bio']);

  $scope.save = function() {
    user.update($scope.editData, function() {
      _.extend(user, $scope.editData);
      $scope.cancel();
    });
  };

  $scope.cancel = function() {
    $scope.$state.go('profile.seeds', {id: user.id});
  };
});

module.exports = function(angularModule) {
  angularModule.controller('ProfileEditCtrl', dependencies);
};
