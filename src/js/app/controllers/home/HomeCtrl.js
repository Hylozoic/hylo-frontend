var controller = function($scope) {

  $scope.openTab = function(name) {
    $scope.selectedTab = name;
    $scope.$state.go('home.' + name);
  };

  $scope.openTab('mySeeds');

};

module.exports = function(angularModule) {
  angularModule.controller('HomeCtrl', controller);
};

