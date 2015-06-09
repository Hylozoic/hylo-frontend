var controller = function($scope, Post, firstPostQuery, user, isSelf, UserCache, PostManager) {

  var postManager = new PostManager({
    firstPage: firstPostQuery,
    scope: $scope,
    attr: 'posts',
    query: function() {
      return Post.queryForUser({
        userId: user.id,
        limit: 10,
        offset: $scope.posts.length
      }).$promise;
    },
    cache: function(posts, total) {
      UserCache.posts.set(user.id, {
        posts: posts,
        posts_total: total
      });
    }
  });

  postManager.setup();

	$scope.hasPosts = $scope.posts.length > 0;
  $scope.isSelf = isSelf;
};

module.exports = function(angularModule) {
  angularModule.controller('PostListCtrl', controller);
};
