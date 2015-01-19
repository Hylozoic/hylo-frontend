var dependencies = ['$scope'];
dependencies.push(function($scope) {
  $scope.foo = 'foo';
});

module.exports = function(angularModule) {
  angularModule.controller('NewSeedCtrl', dependencies);
}