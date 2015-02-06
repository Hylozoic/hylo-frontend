angular.module("hyloControllers").controller('SearchCtrl', [
  '$scope', '$timeout', 'Post', "$log", 'growl', '$q', '$http', '$location', '$analytics', 'query', 'community',
  function($scope, $timeout, Post, $log, growl, $q, $http, $location, $analytics, query, community) {

    $scope.community = community;

    $scope.postType = "all";
    $scope.postSort = "top";

    $scope.start = 0;
    $scope.limit = 12;

    $scope.posts = [];
    $scope.searchQuery = query;

    // Initially Disabled Infinite Scroll
    $scope.disableInfiniteScroll = true;

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
      $scope.disableInfiniteScroll = true;
      $scope.searching = true;

      $http.get('/noo/community/' + community.id + "/seeds", {
        params: {
          q: $scope.searchQuery,
          postType: $scope.postType,
          sort: $scope.postSort,
          start: $scope.start,
          limit: $scope.limit
        },
        timeout: newCanceler.promise,
        responseType: 'json'
      }).success(function(posts) {
        if ($scope.searchQuery) {
          $analytics.eventTrack('Search: Filter', {query: $scope.searchQuery, community_id: community.slug})
        }

        var firstLoad = $scope.posts.length < $scope.limit;

        if (!firstLoad) {
          $analytics.eventTrack('Posts: Load more in Search', {community_id: community.slug});
        }
        else {
          $analytics.eventTrack('Search: Load Search Page', {community_id: community.slug});
        }

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
          $scope.disableInfiniteScroll = true;
        } else {
          $scope.disableInfiniteScroll = false;
        }
      });
    };

    $scope.queryNow();

  }])
