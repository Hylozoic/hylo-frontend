angular.module("hyloControllers").controller('CommunityUsersCtrl', ['$rootScope', '$scope', 'User', '$timeout',
  function($rootScope, $scope, User, $timeout) {

    $rootScope.$watch('community', function(community) {
      community.$promise.then(function() {
        $scope.searching = true;
        if ($rootScope.community.slug) {
          User.query({community: $rootScope.community.slug}, function(users) {
            $scope.searching = false;
            $scope.users = users;
          });
        }
      });
    })

    var queryFn = function() {
      $scope.searching = true;
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
