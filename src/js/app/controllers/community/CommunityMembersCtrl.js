var controller = function($scope, $timeout, $analytics, community, users, totalUsers) {
  $scope.community = community;
  $scope.canInvite = community.canModerate || community.settings.all_can_invite;
  $scope.users = users;
  $scope.totalUsers = totalUsers;

  $scope.loadMore = _.debounce(function() {
    console.log('loading from offset ' + $scope.users.length);
    $scope.loadMoreDisabled = true;

    community.members({
      with: ['skills', 'organizations'],
      limit: 20,
      offset: $scope.users.length
    }, function(users) {
      Array.prototype.push.apply($scope.users, users);

      if ($scope.users.length < $scope.totalUsers)
        $scope.loadMoreDisabled = false;
    });

  }, 100);

  $scope.search = function(term) {
    $scope.$state.go('search', {c: community.id, q: term});
  };
};

module.exports = function(angularModule) {
  angularModule.controller('CommunityMembersCtrl', controller);
}