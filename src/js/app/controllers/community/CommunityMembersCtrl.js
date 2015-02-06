var dependencies = ['$scope', 'OldUser', '$timeout', '$analytics', 'community'];
dependencies.push(function($scope, OldUser, $timeout, $analytics, community) {

  $scope.community = community;

  var queryFn = function() {
    $scope.searching = true;
    $analytics.eventTrack('Members: Query', {community_id: community.slug, query: $scope.searchQuery});
    OldUser.query({
      q: $scope.searchQuery,
      community: community.slug
    }, function(value) {
      $scope.searching = false;
      $scope.users = value;
      $scope.usersLoaded = true;
    });
  };

  queryFn();

  var queryPromise;
  $scope.queryTimeout = function() {
    $timeout.cancel(queryPromise);
    queryPromise = $timeout(queryFn, 750);
  };
});


module.exports = function(angularModule) {
  angularModule.controller('CommunityMembersCtrl', dependencies);
}