var dependencies = ['$scope', '$analytics', 'newCurrentUser'];
dependencies.push(function($scope, $analytics, newCurrentUser) {
  var user = $scope.user = newCurrentUser,
    editData = $scope.editData = _.pick(user, ['bio', 'skills', 'organizations']),
    edited = {};

  $scope.save = function() {
    if (!edited.skills) delete editData.skills;
    if (!edited.organizations) delete editData.organizations;

    user.update(editData, function() {
      _.extend(user, editData);
      $scope.cancel();
    });
  };

  $scope.cancel = function() {
    $scope.$state.go('profile.seeds', {id: user.id});
  };

  $scope.add = function(event, type) {
    if (event.which == 13) {
      editData[type].unshift(event.target.value);
      event.target.value = '';
      edited[type] = true;
    }
    return true;
  };

  $scope.remove = function(value, type) {
    editData[type].splice(editData[type].indexOf(value), 1);
    edited[type] = true;
  }
});

module.exports = function(angularModule) {
  angularModule.controller('ProfileEditCtrl', dependencies);
};
