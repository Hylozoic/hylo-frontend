var controller = function($scope, community) {
  $scope.community = community;
};

module.exports = function(angularModule) {
  angularModule.controller('JoinCommunityByUrlCtrl', controller);
};
