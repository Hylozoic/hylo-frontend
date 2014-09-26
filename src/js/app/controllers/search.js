angular.module("hyloControllers").controller('SearchCtrl', ['$scope', '$rootScope', '$timeout', 'Post', "$log", '$stateParams', 'growl', '$q', '$http', '$location',
  function($scope, $rootScope, $timeout, Post, $log, $stateParams, growl, $q, $http, $location) {

    $scope.postType = "all";
    $scope.postSort = "top";

    $scope.start = 0;
    $scope.limit = 12;

    $scope.posts = [];
    $scope.searchQuery = $stateParams.q;

    // Initially Disabled Infinite Scroll
    $scope.disableInifiniteScroll = true;

    $scope.$watch("postType", function(newFilter) {
      $scope.start = 0;
      $scope.posts = [];
      queryFn();
    });

    $scope.$watch("postSort", function(newFilter) {
      $scope.start = 0;
      $scope.posts = [];
      queryFn();
    });

    var cancelerStack = [];

    $scope.queryTimeout = _.throttle(function() {
      $scope.start = 0;
      $scope.posts = [];
      queryFn();
    }, 750, {leading: false});

    $scope.queryNow = function() {
      queryFn();
    }

    $scope.removePost = function(postToRemove) {
      growl.addSuccessMessage("Seed has been removed: " + postToRemove.name, {ttl: 5000});
      $scope.posts.splice($scope.posts.indexOf(postToRemove), 1);
    }

    var queryFn = function() {
      // Cancel any outstanding queries
      _.each(cancelerStack, function(canceler) { canceler.resolve() });
      cancelerStack = [];

      // Push a new cancelPromise onto stack.
      var newCanceler = $q.defer();
      cancelerStack.push(newCanceler);

      // Disable infinite scroll until the query completes
      $scope.disableInifiniteScroll = true;
      $scope.searching = true;

      $http.get('/posts', {
        params: {
          q: $scope.searchQuery,
          community: $rootScope.community.slug,
          postType: $scope.postType,
          sort: $scope.postSort,
          start: $scope.start,
          limit: $scope.limit
        },
        timeout: newCanceler.promise,
        responseType: 'json'
      }).success(function(posts) {
        // Push posts to stack
        angular.forEach(posts, function(post, key) {
          if (!_.findWhere($scope.posts, {id: post.id})) {
            $scope.posts.push(post);
            $scope.start++;
          }
        });

        $scope.searching = false;
        $scope.noResults = $scope.posts.length == 0;

        if (posts.length == 0) { // There were no more posts... disable infinite scroll now
          $scope.disableInifiniteScroll = true;
        } else {
          $scope.disableInifiniteScroll = false;
        }
      });
    };

    $scope.queryNow();

  }])
