module.exports = function ($scope, $history, $state, post, communities, startingType) {
  'ngInject'

  $scope.post = post
  $scope.editing = !!post
  $scope.communities = communities
  $scope.startingType = startingType

  $scope.close = function () {
    $scope.$broadcast('post-editor-closing')

    if ($history.isEmpty()) {
      if (_.isEmpty(communities)) {
        $state.go('home.allPosts')
      } else {
        $state.go('community.posts', {community: communities[0].slug})
      }
    } else {
      $history.go(-1)
    }
  }

  $scope.$on('post-editor-done', $scope.close)
}
