var controller = function($scope, $analytics, $timeout, growl, currentUser, firstPostQuery, UserCache) {
  $scope.posts = firstPostQuery.posts;
  $scope.hasSeeds = $scope.posts.length > 0;
  $scope.defaultCommunity = currentUser.memberships[0].community;

  $scope.removePost = function(post) {
    growl.addSuccessMessage("Seed has been removed: " + post.name, {ttl: 5000});
    $analytics.eventTrack('Post: Remove', {post_name: post.name, post_id: post.id});
    $scope.posts.splice($scope.posts.indexOf(post), 1);
  };

  $scope.loadMore = _.debounce(function() {
    if ($scope.loadMoreDisabled) return;
    $scope.loadMoreDisabled = true;

    currentUser.allPosts({
      limit: 10,
      offset: $scope.posts.length
    }, function(resp) {
      Array.prototype.push.apply($scope.posts, resp.posts);

      UserCache.allPosts.set({
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
  angularModule.controller('AllSeedsCtrl', controller);
};