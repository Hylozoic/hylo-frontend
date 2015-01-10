var dependencies = ['$scope', '$analytics', 'User', 'user', 'editable'];
dependencies.push(function($scope, $analytics, User, user, editable) {
  $scope.user = user;
  $scope.editable = editable;

  if (!user.banner_url) {
    user.banner_url = require('../services/defaultUserBanner');
  }
});

module.exports = function(angularModule) {
  angularModule.controller('ProfileCtrl', dependencies);
};
