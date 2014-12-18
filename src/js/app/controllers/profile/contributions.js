var dependencies = ['$scope', '$analytics', 'User'];
dependencies.push(function($scope, $analytics, User) {

  $scope.user.$promise.then(function() {
    $scope.user.contributions({}, function(contributions) {
      $scope.contributions = contributions;
      console.log(contributions)
    });
  });
});

module.exports = function(angularModule) {
  angularModule.controller('ProfileContributionsCtrl', dependencies);
};
