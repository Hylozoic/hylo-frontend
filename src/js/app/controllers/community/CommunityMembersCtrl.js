var dependencies = ['$scope', '$timeout', '$analytics', 'community'];
dependencies.push(function($scope, $timeout, $analytics, community) {

  $scope.community = community;

  var queryFn = function(initial) {
    $scope.searching = true;
    if (!initial) {
      $analytics.eventTrack('Members: Query', {community_id: community.slug, query: $scope.searchQuery});
    }
    community.members({search: $scope.searchQuery}, function(users) {
      $scope.searching = false;
      $scope.users = users;
      $scope.usersLoaded = true;
    });
  };

  queryFn(true);

  var queryPromise;
  $scope.queryTimeout = function() {
    $timeout.cancel(queryPromise);
    queryPromise = $timeout(queryFn, 750);
  };
});


module.exports = function(angularModule) {
  angularModule.controller('CommunityMembersCtrl', dependencies);
}