angular.module("hyloControllers").controller('ViewPostCtrl', ['$scope', 'Post', '$rootScope', '$stateParams', '$state', 'growl',
  function($scope, Post, $rootScope, $stateParams, $state, growl) {
    $scope.post = Post.get({id: $stateParams.postId});

    $scope.postdeleted = function(deletedPost) {
      growl.addSuccessMessage("Seed has been removed: " + deletedPost.name, {ttl: 5000});
      $state.go("community", {community: deletedPost.communitySlug});
    }
  }]);
