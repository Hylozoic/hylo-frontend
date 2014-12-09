angular.module("hyloControllers").controller('CommunityUsersCtrl', ['$scope', 'OldUser', '$timeout', '$analytics',
  function($scope, OldUser, $timeout, $analytics) {

    $scope.community.$promise.then(function() {
      $scope.searching = true;
      if ($scope.community.slug) {
        OldUser.query({community: $scope.community.slug}, function(users) {
          $scope.searching = false;
          $scope.users = users;
        });
      }
    });

    var queryFn = function() {
      $scope.searching = true;
      $analytics.eventTrack('Members: Query', {community_id: $scope.community.slug, query: $scope.searchQuery});
      OldUser.query({
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
