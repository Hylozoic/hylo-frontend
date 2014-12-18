var dependencies = ['$scope', '$analytics', '$stateParams', 'User', '$state', 'user', 'editable'];
dependencies.push(function($scope, $analytics, $stateParams, User, $state, user, editable) {
	$scope.hello = 'on two lines';

  $scope.state = $state;

  $scope.user = user;
  $scope.editable = editable;

});

module.exports = function(angularModule) {
  angularModule.controller('ProfileCtrl', dependencies);
};
