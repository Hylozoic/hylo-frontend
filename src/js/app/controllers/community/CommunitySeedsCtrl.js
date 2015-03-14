var controller = function($scope, Post, growl, $timeout, $http, $q, $modal, $analytics, community, onboarding) {

  $scope.onboarding = onboarding;
  if (onboarding && onboarding.currentStep() === 'community') {
    onboarding.showOverlay('community');
  }

  $scope.community = community;

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

  $scope.query = function(doReset) {

    // Cancel any outstanding queries
    _.each(cancelerStack, function(canceler) { canceler.resolve() });
    cancelerStack = [];

    var newCanceler = $q.defer();
    cancelerStack.push(newCanceler);

    $scope.disableInfiniteScroll = true;
    $scope.searching = true;

    $http.get('/noo/community/' + community.id + "/seeds", {
      params: {
        q: $scope.searchQuery,
        postType: $scope.selected.filter.value,
        sort: $scope.selected.sort.value,
        start: $scope.start,
        limit: $scope.limit
      },
      timeout: newCanceler.promise,
      responseType: 'json'
    }).success(function(posts) {
      $scope.searching = false;
      $scope.postLoaded = true;

      if ($scope.searchQuery) {
        $analytics.eventTrack('Posts: Filter by Query', {query: $scope.searchQuery, community_id: community.slug})
      }

      var firstLoad = $scope.posts.length < $scope.limit;
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

  $scope.remove = function(postToRemove) {
    growl.addSuccessMessage("Seed has been removed: " + postToRemove.name, {ttl: 5000});
    $analytics.eventTrack('Post: Remove a Seed', {post_name: postToRemove.name, post_id: postToRemove.id});
    $scope.posts.splice($scope.posts.indexOf(postToRemove), 1);
  };

  $scope.selectOptions = {
    sort: [
      {label: 'Recent', value: 'recent'},
      {label: 'Top', value: 'top'}
    ],
    filter: [
      {label: 'All Seeds', value: 'all'},
      {label: 'Intentions', value: 'intention'},
      {label: 'Offers', value: 'offer'},
      {label: 'Requests', value: 'request'}
    ]
  };

  $scope.selected = {
    sort: $scope.selectOptions.sort[0],
    filter: $scope.selectOptions.filter[0]
  };

  $scope.select = function(type, value) {
    $scope.selected[type] = _.find(
      $scope.selectOptions[type],
      function(x) { return x.value === value }
    );

    $scope.resetQuery();
  };

  $scope.query();
};

module.exports = function(angularModule) {
  angularModule.controller('CommunitySeedsCtrl', controller);
};