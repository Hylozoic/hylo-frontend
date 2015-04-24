var controller = function($scope, Seed, growl, seed, currentUser, $stateParams) {
  $scope.post = seed;

  $scope.postdeleted = function(deletedPost) {
    growl.addSuccessMessage("Seed has been removed: " + deletedPost.name, {ttl: 5000});
    $scope.$state.go("community.seeds", {community: deletedPost.community.slug});
  };

  if ($stateParams.action === 'unfollow') {
    seed.unfollow({}, function() {
      seed.followers = _.without(seed.followers, _.findWhere(seed.followers, {id: '' + currentUser.id}));
      growl.addSuccessMessage('You are no longer following this post.', {ttl: 8000});
    });
  }
};

module.exports = function(angularModule) {
  angularModule.controller('SeedCtrl', controller);
};
