var dependencies = ['$scope', 'growl', '$analytics', '$state', 'currentUser', 'Community'];
dependencies.push(function($scope, growl, $analytics, $state, currentUser, Community) {

  var user = $scope.user = currentUser,
    editing = $scope.editing = {},
    edited = $scope.edited = {};

  $analytics.eventTrack('User Settings: Viewed');

  $scope.close = function() {
    $state.go('profile', {id: user.id});
  };

  $scope.needsRevalidation = function() {
    return user.provider_key == 'password';
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
      growl.addSuccessMessage('Saved change.');
      if (field === 'email' && $scope.needsRevalidation()) {
        growl.addSuccessMessage('Reloading...')
        setTimeout(function() {
          window.location = '/accounts/unverified';
        }, 3000);
      }
    }, function(err) {
      growl.addErrorMessage(err.data);
    });
  };

  $scope.toggle = function(field) {
    var data = {};
    data[field] = user[field];
    user.update(data, function() {
      growl.addSuccessMessage('Saved change.');
    }, function(err) {
      growl.addErrorMessage(err.data);
    })
  };

  $scope.leaveCommunity = function(communityId, index) {
    if (!confirm('Are you sure you want to leave this community?'))
      return;

    Community.removeMember({id: communityId, user_id: user.id}, function() {
      user.memberships.splice(index, 1);
    }, function(err) {
      growl.addErrorMessage(err.data);
    });
  };

});

module.exports = function(angularModule) {
  angularModule.controller('UserSettingsCtrl', dependencies);
};
