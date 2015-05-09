var controller = function($scope, growl, $stateParams, $analytics, currentUser, Community, $history, $dialog, UserCache) {

  var user = $scope.user = currentUser,
    editing = $scope.editing = {},
    edited = $scope.edited = {};

  $analytics.eventTrack('User Settings: Viewed');

  if ($stateParams.expand === 'password') {
    $scope.expand1 = true;
    editing.password = true;
  }

  $scope.close = function() {
    if ($history.isEmpty()) {
      $scope.$state.go('profile.seeds', {id: user.id});
    } else {
      $history.go(-1);
    }
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
        UserCache.allPosts.clear(currentUser.id);
      });
    })
  };

};

module.exports = function(angularModule) {
  angularModule.controller('UserSettingsCtrl', controller);
};
