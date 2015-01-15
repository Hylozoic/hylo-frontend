var dependencies = ['$scope', '$analytics', 'thanks'];
dependencies.push(function($scope, $analytics, thanks) {
  $scope.thanks = thanks;
});

module.exports = function(angularModule) {
  angularModule.controller('ProfileThanksCtrl', dependencies);
};
