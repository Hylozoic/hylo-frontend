var controller = function($scope, Seed, firstPostQuery, user, isSelf, UserCache, PostManager) {

  var postManager = new PostManager({
    firstPage: firstPostQuery,
    scope: $scope,
    attr: 'posts',
    query: function() {
      return Seed.queryForUser({
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

	$scope.hasSeeds = $scope.posts.length > 0;
  $scope.isSelf = isSelf;
};

module.exports = function(angularModule) {
  angularModule.controller('SeedListCtrl', controller);
};
