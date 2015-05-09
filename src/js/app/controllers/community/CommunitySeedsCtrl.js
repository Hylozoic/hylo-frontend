var controller = function($scope, Cache, Seed, growl, $analytics, community, onboarding, firstPostQuery) {

  $scope.onboarding = onboarding;
  $scope.community = community;
  $scope.posts = firstPostQuery.posts;
  $scope.loadMoreDisabled = $scope.posts.length >= firstPostQuery.posts_total;

  $scope.loadMore = _.debounce(function() {
    if ($scope.loadMoreDisabled) return;
    $scope.loadMoreDisabled = true;

    Seed.queryForCommunity({
      communityId: community.id,
      limit: 10,
      offset: $scope.posts.length,
      type: $scope.selected.filter.value,
      sort: $scope.selected.sort.value
    }, function(resp) {
      $scope.posts = _.uniq($scope.posts.concat(resp.posts), function(seed) {
        return seed.id;
      });

      Cache.set('community.posts:' + community.id, {
        posts: $scope.posts,
        posts_total: resp.posts_total
      }, {maxAge: 10 * 60});

      if (resp.posts.length > 0 && $scope.posts.length < resp.posts_total)
        $scope.loadMoreDisabled = false;
    });
  }, 200);

  $scope.remove = function(postToRemove) {
    growl.addSuccessMessage("Seed has been removed: " + postToRemove.name, {ttl: 5000});
    $analytics.eventTrack('Post: Remove', {post_name: postToRemove.name, post_id: postToRemove.id});
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

    $scope.posts = [];
    $scope.loadMoreDisabled = false;
    $scope.loadMore();
  };

};

module.exports = function(angularModule) {
  angularModule.controller('CommunitySeedsCtrl', controller);
};