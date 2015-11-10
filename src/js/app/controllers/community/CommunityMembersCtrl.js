var controller = function($scope, community, usersQuery, $dialog, Cache, currentUser, $timeout) {
  $scope.users = usersQuery.people;
  $scope.userCount = usersQuery.people_total;

  $scope.loadMore = _.debounce(function() {
    if ($scope.loadMoreDisabled) return;
    $scope.loadMoreDisabled = true;

    community.members({offset: $scope.users.length}, function(resp) {
      $scope.users = _.uniq($scope.users.concat(resp.people), u => u.id);

      Cache.set('community.members:' + community.id, {
        people: $scope.users,
        people_total: resp.people_total
      }, {maxAge: 10 * 60});

      $scope.userCount = resp.people_total;

      if (resp.people.length > 0 && $scope.users.length < resp.people_total)
        $timeout(function() { $scope.loadMoreDisabled = false; });
    });

  }, 200);

  $scope.search = function(term) {
    $scope.$state.go('search', {c: community.id, q: term});
  };

  $scope.remove = function(user, index) {
    $dialog.confirm({
      message: 'Are you sure you want to remove ' + user.name + ' from this community?',
    }).then(function() {
      community.removeMember({userId: user.id}, function() {
        $scope.users.splice(index, 1);
      });
    });
  };

};

module.exports = function(angularModule) {
  angularModule.controller('CommunityMembersCtrl', controller);
};
