var dependencies = ['$scope', 'growl', '$analytics', '$state', 'newCurrentUser'];
dependencies.push(function($scope, growl, $analytics, $state, newCurrentUser) {

  var user = $scope.user = newCurrentUser,
    editing = $scope.editing = {},
    edited = $scope.edited = {};

  $analytics.eventTrack('User Settings: Viewed');

  $scope.close = function() {
    $state.go('profile.seeds', {id: user.id});
  };

  $scope.needsRevalidation = function() {
    return _.any(user.linkedAccounts, function(account) {
      return account.provider_key == 'password';
    });
  };

  $scope.edit = function(field) {
    edited[field] = user[field];
    editing[field] = true;
  };

  $scope.cancelEdit = function(field) {
    editing[field] = false;
  };

  $scope.saveEdit = function(field) {
    editing[field] = false;
    var data = {};
    data[field] = edited[field];

    user.update(data, function() {
      user[field] = edited[field];
      $analytics.eventTrack('User Settings: Changed ' + field, {user_id: user.id});
      growl.addSuccessMessage('Saved changes.');
      if ($scope.needsRevalidation()) {
        window.location = '/accounts/unverified';
      }
    }, function(err) {
      growl.addErrorMessage(err.data.message);
    });
  };

});

module.exports = function(angularModule) {
  angularModule.controller('UserSettingsCtrl', dependencies);
};
