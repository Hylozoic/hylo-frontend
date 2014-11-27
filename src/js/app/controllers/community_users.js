angular.module("hyloControllers").controller('CommunityUsersCtrl', ['$scope', 'User', '$timeout', '$analytics',
  function($scope, User, $timeout, $analytics) {

    $scope.community.$promise.then(function() {
      $scope.searching = true;
      if ($scope.community.slug) {
        User.query({community: $scope.community.slug}, function(users) {
          $scope.searching = false;
          $scope.users = users;
        });
      }
    });

    var queryFn = function() {
      $scope.searching = true;
      $analytics.eventTrack('Members: Query', {community_id: $scope.community.slug, query: $scope.searchQuery});
      User.query({
        q: $scope.searchQuery,
        community: $scope.community.slug
      }, function(value) {
        $scope.searching = false;
        $scope.users = value;
        $scope.usersLoaded = true;
      });
    };

    var queryPromise;
    $scope.queryTimeout = function() {
      $timeout.cancel(queryPromise);

      queryPromise = $timeout(queryFn, 750);
    };
  }]);
