var controller = function($scope, currentUser, firstPostQuery, UserCache, PostManager) {
  $scope.posts = firstPostQuery.posts;
  $scope.hasPosts = $scope.posts.length > 0;

  var postManager = new PostManager({
    firstPage: firstPostQuery,
    scope: $scope,
    attr: 'posts',
    query: function() {
      return currentUser.followedPosts({
        limit: 10,
        offset: $scope.posts.length
      }).$promise;
    },
    cache: function(posts, total) {
      UserCache.followedPosts.set(currentUser.id, {
        posts: posts,
        posts_total: total
      });
    }
  });

  postManager.setup();

};

module.exports = function(angularModule) {
  angularModule.controller('FollowedPostsCtrl', controller);
};