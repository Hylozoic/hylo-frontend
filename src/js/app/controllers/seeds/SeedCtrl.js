var dependencies = ['$scope', 'Seed', '$state', 'growl', 'seed'];
dependencies.push(function($scope, Seed, $state, growl, seed) {
  $scope.post = seed;

  $scope.postdeleted = function(deletedPost) {
    growl.addSuccessMessage("Seed has been removed: " + deletedPost.name, {ttl: 5000});
    $state.go("community.seeds", {community: deletedPost.communitySlug});
  }
});

module.exports = function(angularModule) {
  angularModule.controller('SeedCtrl', dependencies);
};
