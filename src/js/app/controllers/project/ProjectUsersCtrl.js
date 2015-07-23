module.exports = function ($scope, $stateParams, project, users, $dialog) {
  "ngInject";
  $scope.users = users;

  $scope.$on('joinProject', function() {
    $scope.users = [];
    $scope.loadMoreDisabled = false;
    $scope.loadMore();
  });

  $scope.loadMore = _.debounce(function() {
    if ($scope.loadMoreDisabled) return;
    $scope.loadMoreDisabled = true;

    project.users({
      limit: 20,
      offset: $scope.users.length,
      token: $stateParams.token
    }, function(users) {
      Array.prototype.push.apply($scope.users, users);

      if (users.length > 0 && $scope.users.length < users[0].total)
        $scope.loadMoreDisabled = false;
    });

  }, 200);

  $scope.remove = function(user, index) {
    $dialog.confirm({
      message: 'Are you sure you want to remove ' + user.name + ' from this project?',
    }).then(function() {
      project.removeUser({userId: user.id}, function() {
        $scope.users.splice(index, 1);
      });
    });
  };

  $scope.toggleModerator = function(user, index) {
    var newRole = user.membership.role === 1 ? 0 : 1;
    user.membership.role = newRole;
    project.toggleModeratorRole({userId: user.id, role: newRole});
  };

  $scope.isModerator = function(user) {
    return user.membership.role === 1;
  }

};
