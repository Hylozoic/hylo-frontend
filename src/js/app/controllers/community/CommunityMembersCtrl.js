var truncate = require('html-truncate');

var directive = function($scope, $timeout, $analytics, community) {
  $scope.community = community;

  var queryFn = function(initial) {
    $scope.searching = true;
    if (!initial) {
      $analytics.eventTrack('Members: Query', {community_id: community.slug, query: $scope.searchQuery});
    }
    community.members({search: $scope.searchQuery, with: ['skills', 'organizations']}, function(users) {
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

  $scope.truncate = function(list) {
    return truncate(list.join(', '), 100);
  };
};

module.exports = function(angularModule) {
  angularModule.controller('CommunityMembersCtrl', directive);
}