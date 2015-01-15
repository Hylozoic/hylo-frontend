var dependencies = ['$scope', '$analytics', 'contributions'];
dependencies.push(function($scope, $analytics, contributions ) {
  $scope.contributions = contributions;
});

module.exports = function(angularModule) {
  angularModule.controller('ProfileContributionsCtrl', dependencies);
};
