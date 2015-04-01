var controller = function($scope, $analytics, $timeout, growl, currentUser, firstSeedQuery, UserCache) {
  $scope.seeds = firstSeedQuery.seeds;
  $scope.hasSeeds = $scope.seeds.length > 0;
  $scope.defaultCommunity = currentUser.memberships[0].community;

  $scope.removePost = function(post) {
    growl.addSuccessMessage("Seed has been removed: " + post.name, {ttl: 5000});
    $analytics.eventTrack('Post: Remove a Seed', {post_name: post.name, post_id: post.id});
    $scope.seeds.splice($scope.seeds.indexOf(post), 1);
  };

  $scope.loadMore = _.debounce(function() {
    if ($scope.loadMoreDisabled) return;
    $scope.loadMoreDisabled = true;

    currentUser.allSeeds({
      limit: 10,
      offset: $scope.seeds.length
    }, function(resp) {
      Array.prototype.push.apply($scope.seeds, resp.seeds);

      UserCache.allSeeds.set({
        seeds: $scope.seeds,
        seeds_total: resp.seeds_total
      });

      $timeout(function() {
        if (resp.seeds.length > 0 && $scope.seeds.length < resp.seeds_total)
          $scope.loadMoreDisabled = false;
      });
    });
  }, 200);

};

module.exports = function(angularModule) {
  angularModule.controller('AllSeedsCtrl', controller);
};