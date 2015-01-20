var dependencies = ['$scope'];
dependencies.push(function($scope) {
  $scope.foo = 'foo';

  //$scope.seedType = 'intention';

  $scope.switchSeedType = function(seedType) {
  	$scope.seedType = seedType;
  	if (seedType === 'intention') {
  		$scope.titleText = "I'd like to create ";
  	}
  	else if (seedType === 'offer') {
  		$scope.titleText = "I'd like to share ";

  	}
  	else if (seedType === 'request') {
  		$scope.titleText = "I'm looking for ";
  	}
  }

  $scope.switchSeedType('intention');

});

module.exports = function(angularModule) {
  angularModule.controller('NewSeedCtrl', dependencies);
}