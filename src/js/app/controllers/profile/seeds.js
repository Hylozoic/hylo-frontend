var controller = function($scope, $analytics, growl, Seed, firstSeedQuery, user) {
	$scope.seeds = firstSeedQuery.seeds;
	$scope.hasSeeds = $scope.seeds.length > 0;

	$scope.removePost = function(post) {
    growl.addSuccessMessage("Seed has been removed: " + post.name, {ttl: 5000});
    $analytics.eventTrack('Post: Remove a Seed', {post_name: post.name, post_id: post.id});
    $scope.seeds.splice($scope.seeds.indexOf(post), 1);
  };

  $scope.loadMore = _.debounce(function() {
    if ($scope.loadMoreDisabled) return;
    $scope.loadMoreDisabled = true;

    Seed.queryForUser({
      userId: user.id,
      limit: 10,
      offset: $scope.seeds.length
    }, function(resp) {
      Array.prototype.push.apply($scope.seeds, resp.seeds);

      if (resp.seeds.length > 0 && $scope.seeds.length < resp.seeds_total)
        $scope.loadMoreDisabled = false;
    });
  }, 200);

};

module.exports = function(angularModule) {
  angularModule.controller('ProfileSeedsCtrl', controller);
};
