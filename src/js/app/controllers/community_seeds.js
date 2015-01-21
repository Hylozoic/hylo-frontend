angular.module("hyloControllers").controller('CommunitySeedsCtrl',
  ['$scope', 'Post', 'growl', '$timeout', '$http', '$q', '$modal', '$analytics',
  function($scope, Post, growl, $timeout, $http, $q, $modal, $analytics) {

    $scope.$watch('community', function watchCommunity(communityPromise) {
      if (communityPromise) {
        communityPromise.$promise.then(function () {
          $scope.query();
        });
      }
    });

    $scope.start = 0;
    $scope.limit = 12;
    $scope.postLoaded = false;

    $scope.posts = [];
    $scope.searchQuery = "";

    // Initially Disabled Infinite Scroll
    $scope.disableInfiniteScroll = true;

    var cancelerStack = [];

    $scope.resetQuery = function () {
      $scope.start = 0;
      $scope.query(true);
    }

    $scope.queryTimeout = _.throttle(function throttledQueryTimeout() {
      $scope.resetQuery();
    }, 750, {leading: false});


    $scope.$watch("seedFilter", function () {
      if (!$scope.postLoaded) return;
      $analytics.eventTrack('Posts: Filter by Type', {filter_by: $scope.seedFilter, community_id: $scope.community.id});
      $scope.resetQuery();
    });

    $scope.$watch("seedSort", function() {
      if (!$scope.postLoaded) return;
      $analytics.eventTrack('Posts: Sort', {sort_by: $scope.seedSort, community_id: $scope.community.id});
      $scope.resetQuery();
    });

    $scope.query = function(doReset) {

      // Cancel any outstanding queries
      _.each(cancelerStack, function(canceler) { canceler.resolve() });
      cancelerStack = [];

      var newCanceler = $q.defer();
      cancelerStack.push(newCanceler);

      $scope.disableInfiniteScroll = true;
      $scope.searching = true;

      $http.get('/noo/community/' + $scope.community.id + "/seeds", {
        params: {
          q: $scope.searchQuery,
          postType: $scope.seedFilter,
          sort: $scope.seedSort,
          start: $scope.start,
          limit: $scope.limit
        },
        timeout: newCanceler.promise,
        responseType: 'json'
      }).success(function(posts) {
        $scope.searching = false;
        $scope.postLoaded = true;

        if ($scope.searchQuery) {
          $analytics.eventTrack('Posts: Filter by Query', {query: $scope.searchQuery, community_id: $scope.community.slug})
        }

        var firstLoad = $scope.posts.length < $scope.limit;
        if (!firstLoad) {
          $analytics.eventTrack('Posts: Load more in Feed', {community_id: $scope.community.slug});
        }

        if (doReset) {
          $scope.posts = [];
        }

        angular.forEach(posts, function(post, key) {
          if (!_.findWhere($scope.posts, {id: post.id})) {
            $scope.posts.push(post);
            $scope.start++;
          }
        });

        if (posts.length == 0) { // There were no more posts... disable infinite scroll now
          $scope.disableInfiniteScroll = true;
        } else {
          $scope.disableInfiniteScroll = false;
        }
      });
    };

    $scope.addSeedSuccess = function(newSeed) {
      growl.addSuccessMessage("Successfully created new seed: " + newSeed.name, {ttl: 5000});
      $analytics.eventTrack('Post: Add New Seed', {seed_id: newSeed.id, seed_name: newSeed.name, seed_community_name: newSeed.cName, seed_community_slug: newSeed.communitySlug, post_type: newSeed.postType});
      $scope.posts.unshift(newSeed);
      $scope.showSeedForm = false;
    };

    $scope.addSeedCancel = function(){
      $scope.showSeedForm = false;
    };

    $scope.addSeed = function(){
      $scope.showSeedForm = true;
      $analytics.eventTrack('Post: Open Add Seed Form');
    };

    $scope.remove = function(postToRemove) {
      growl.addSuccessMessage("Seed has been removed: " + postToRemove.name, {ttl: 5000});
      $analytics.eventTrack('Post: Remove a Seed', {post_name: postToRemove.name, post_id: postToRemove.id});
      $scope.posts.splice($scope.posts.indexOf(postToRemove), 1);
    };


  }]);
