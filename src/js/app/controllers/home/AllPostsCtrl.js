var controller = function($scope, currentUser, firstPostQuery, UserCache, PostManager) {

  var postManager = new PostManager({
    firstPage: firstPostQuery,
    scope: $scope,
    attr: 'posts',
    query: function() {
      return currentUser.allPosts({
        limit: 10,
        offset: $scope.posts.length
      }).$promise;
    },
    cache: function(posts, total) {
      UserCache.allPosts.set({
        posts: posts,
        posts_total: total
      });
    }
  });

  postManager.setup();

  $scope.hasPosts = $scope.posts.length > 0;
  $scope.defaultCommunity = currentUser.memberships[0].community;

};

module.exports = function(angularModule) {
  angularModule.controller('AllPostsCtrl', controller);
};