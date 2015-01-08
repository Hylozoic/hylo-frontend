var dependencies = ['$scope', '$analytics', 'User', 'user', 'editable'];
dependencies.push(function($scope, $analytics, User, user, editable) {
  $scope.user = user;
  $scope.editable = editable;
});

module.exports = function(angularModule) {
  angularModule.controller('ProfileCtrl', dependencies);
};
