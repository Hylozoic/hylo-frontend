var dependencies = ['$scope', '$analytics', 'newCurrentUser'];
dependencies.push(function($scope, $analytics, newCurrentUser) {
  var user = $scope.user = newCurrentUser;

  $scope.editData = _.pick(user, ['bio', 'skills', 'organizations']);

  $scope.save = function() {
    user.update($scope.editData, function() {
      _.extend(user, $scope.editData);
      $scope.cancel();
    });
  };

  $scope.cancel = function() {
    $scope.$state.go('profile.seeds', {id: user.id});
  };

  $scope.add = function(event, type) {
    if (event.which == 13) {
      $scope.editData[type].unshift(event.target.value);
      event.target.value = '';
    }
    return true;
  };
});

module.exports = function(angularModule) {
  angularModule.controller('ProfileEditCtrl', dependencies);
};
