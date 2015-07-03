module.exports = ($scope, $stateParams, project, users, $dialog) => {
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

};
