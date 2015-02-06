var dependencies = ['$scope', 'Seed', '$stateParams', '$state', 'growl'];
dependencies.push(function($scope, Seed, $stateParams, $state, growl) {
  $scope.post = Seed.get({id: $stateParams.postId});

  $scope.postdeleted = function(deletedPost) {
    growl.addSuccessMessage("Seed has been removed: " + deletedPost.name, {ttl: 5000});
    $state.go("community.seeds", {community: deletedPost.communitySlug});
  }
});

module.exports = function(angularModule) {
  angularModule.controller('SeedCtrl', dependencies);
};
