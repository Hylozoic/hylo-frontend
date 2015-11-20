module.exports = function ($scope, project, Post, Cache, UserCache, growl,
  $analytics, currentUser, postQuery, $stateParams, UserMentions, PostManager) {
  'ngInject'

  $scope.currentUser = currentUser

  var postManager = new PostManager({
    firstPage: postQuery,
    scope: $scope,
    attr: 'posts',
    query: function () {
      return project.posts({
        limit: 10,
        offset: $scope.posts.length,
        token: $stateParams.token
      }).$promise
    }
  })

  postManager.setup()

  $scope.$on('post-editor-done', function (event, payload) {
    if (payload.action === 'create') {
      postManager.reload()
    }
  })
}
