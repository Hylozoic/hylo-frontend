var controller = function($scope, Cache, Seed, growl, $analytics, community, onboarding, firstSeedQuery) {

  $scope.onboarding = onboarding;
  if (onboarding && onboarding.currentStep() === 'community') {
    onboarding.showOverlay('community');
  }

  $scope.community = community;
  $scope.seeds = firstSeedQuery.seeds;
  $scope.loadMoreDisabled = $scope.seeds.length >= firstSeedQuery.seeds_total;

  $scope.loadMore = _.debounce(function() {
    if ($scope.loadMoreDisabled) return;
    $scope.loadMoreDisabled = true;

    Seed.queryForCommunity({
      communityId: community.id,
      limit: 10,
      offset: $scope.seeds.length,
      type: $scope.selected.filter.value,
      sort: $scope.selected.sort.value
    }, function(resp) {
      $scope.seeds = _.uniq($scope.seeds.concat(resp.seeds), function(seed) {
        return seed.id;
      });

      Cache.set('community.seeds:' + community.id, {
        seeds: $scope.seeds,
        seeds_total: resp.seeds_total
      }, {maxAge: 10 * 60});

      if (resp.seeds.length > 0 && $scope.seeds.length < resp.seeds_total)
        $scope.loadMoreDisabled = false;
    });
  }, 200);

  $scope.remove = function(postToRemove) {
    growl.addSuccessMessage("Seed has been removed: " + postToRemove.name, {ttl: 5000});
    $analytics.eventTrack('Post: Remove a Seed', {post_name: postToRemove.name, post_id: postToRemove.id});
    $scope.seeds.splice($scope.seeds.indexOf(postToRemove), 1);
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

    $scope.seeds = [];
    $scope.loadMoreDisabled = false;
    $scope.loadMore();
  };

};

module.exports = function(angularModule) {
  angularModule.controller('CommunitySeedsCtrl', controller);
};