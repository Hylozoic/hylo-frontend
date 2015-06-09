var controller = function($scope, Post, growl, post, currentUser, $stateParams) {
  $scope.post = post;

  $scope.postdeleted = function(deletedPost) {
    growl.addSuccessMessage("Seed has been removed: " + deletedPost.name, {ttl: 5000});
    $scope.$state.go("community.posts", {community: deletedPost.community.slug});
  };

  if ($stateParams.action === 'unfollow') {
    post.unfollow({}, function() {
      post.followers = _.without(post.followers, _.findWhere(post.followers, {id: '' + currentUser.id}));
      growl.addSuccessMessage('You are no longer following this seed.', {ttl: 8000});
    });
  }
};

module.exports = function(angularModule) {
  angularModule.controller('PostCtrl', controller);
};
