var dependencies = ['$scope', 'community'];
dependencies.push(function($scope, community) {
  $scope.community = community;
});

module.exports = function(angularModule) {
  angularModule.controller('CommunityAboutCtrl', dependencies);
}