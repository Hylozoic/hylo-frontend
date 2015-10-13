module.exports = function ($scope, currentUser, firstPostQuery, UserCache, PostManager) {
  'ngInject'

  var postManager = new PostManager({
    firstPage: firstPostQuery,
    scope: $scope,
    attr: 'posts',
    query: function () {
      return currentUser.allPosts({
        limit: 10,
        offset: $scope.posts.length,
        type: $scope.selected.filter.value,
        sort: $scope.selected.sort.value
      }).$promise
    },
    cache: function (posts, total) {
      UserCache.allPosts.set({
        posts: posts,
        posts_total: total
      })
    }
  })

  postManager.setup()

  $scope.hasPosts = $scope.posts.length > 0

  $scope.updateView = function (data) {
    $scope.selected = data
    postManager.reload()
  }

  $scope.$on('post-editor-done', function (event, payload) {
    if (payload.action === 'create') {
      postManager.reload()
    }
  })
}
