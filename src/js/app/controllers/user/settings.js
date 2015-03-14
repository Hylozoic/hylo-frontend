var controller = function($scope, growl, $analytics, currentUser, Community, $history, $dialog) {

  var user = $scope.user = currentUser,
    editing = $scope.editing = {},
    edited = $scope.edited = {};

  $analytics.eventTrack('User Settings: Viewed');

  $scope.close = function() {
    if ($history.isEmpty()) {
      $scope.$state.go('profile', {id: user.id});
    } else {
      $history.go(-1);
    }
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
    $dialog.confirm({
      message: 'Are you sure you want to leave this community?'
    }).then(function() {
      Community.leave({id: communityId}, function() {
        user.memberships.splice(index, 1);
      });
    })
  };

};

module.exports = function(angularModule) {
  angularModule.controller('UserSettingsCtrl', controller);
};
