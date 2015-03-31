var controller = function($scope) {
  $scope.value = 'DOLOR';
};

module.exports = function(angularModule) {
  angularModule.controller('HomeCtrl', controller);
};

