module.exports = function ($scope, community, currentUser, firstPostQuery, Post, PostManager) {
  'ngInject'

  $scope.currentUser = currentUser

  var postManager = new PostManager({
    firstPage: firstPostQuery,
    scope: $scope,
    attr: 'posts',
    query: function () {
      return Post.queryForCommunity({
        communityId: community.id,
        limit: 10,
        offset: $scope.posts.length,
        type: 'event',
        sort: 'start_time',
        filter: $scope.showPastEvents ? null : 'future'
      }).$promise
    }
  })

  postManager.setup()

  $scope.updateView = function () {
    postManager.reload()
  }
}
