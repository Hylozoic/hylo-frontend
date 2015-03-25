

var controller = function($scope, $analytics, $history, $rootScope, Community) {
  console.log("help");

  console.dir($scope);
  console.dir($rootScope)

  $scope.close = function() {
    if ($history.isEmpty()) {
      //$state.go('community.seeds', {community: community.slug});
    } else {
      $history.go(-1);
    }
  };
};

module.exports = function(angularModule) {
  angularModule.controller('SupportCtrl', controller);
};