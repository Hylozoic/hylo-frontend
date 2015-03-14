var controller = function($scope, $timeout, $analytics, $modal, community, users, $dialog) {
  $scope.community = community;
  $scope.canInvite = community.canModerate || community.settings.all_can_invite;
  $scope.canModerate = community.canModerate;
  $scope.users = users;

  $scope.loadMore = _.debounce(function() {
    $scope.loadMoreDisabled = true;

    community.members({
      with: ['skills', 'organizations'],
      limit: 20,
      offset: $scope.users.length
    }, function(users) {
      Array.prototype.push.apply($scope.users, users);

      if (users.length > 0 && $scope.users.length < users[0].total)
        $scope.loadMoreDisabled = false;
    });

  }, 100);

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
}