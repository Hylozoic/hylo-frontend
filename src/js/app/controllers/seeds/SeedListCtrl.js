var controller = function($scope, $analytics, $timeout, growl, Seed, firstPostQuery, user, isSelf, UserCache) {
	$scope.posts = firstPostQuery.posts;
	$scope.hasSeeds = $scope.posts.length > 0;
  $scope.isSelf = isSelf;

	$scope.removePost = function(post) {
    growl.addSuccessMessage("Seed has been removed: " + post.name, {ttl: 5000});
    $analytics.eventTrack('Post: Remove', {post_name: post.name, post_id: post.id});
    $scope.posts.splice($scope.posts.indexOf(post), 1);
  };

  $scope.loadMore = _.debounce(function() {
    if ($scope.loadMoreDisabled) return;
    $scope.loadMoreDisabled = true;

    Seed.queryForUser({
      userId: user.id,
      limit: 10,
      offset: $scope.posts.length
    }, function(resp) {
      Array.prototype.push.apply($scope.posts, resp.posts);

      UserCache.posts.set(user.id, {
        posts: $scope.posts,
        posts_total: resp.posts_total
      });

      $timeout(function() {
        if (resp.posts.length > 0 && $scope.posts.length < resp.posts_total)
          $scope.loadMoreDisabled = false;
      });
    });
  }, 200);

};

module.exports = function(angularModule) {
  angularModule.controller('SeedListCtrl', controller);
};
