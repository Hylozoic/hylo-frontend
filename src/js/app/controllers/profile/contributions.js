var dependencies = ['$scope', '$analytics', 'User'];
dependencies.push(function($scope, $analytics, User) {


});

module.exports = function(angularModule) {
  angularModule.controller('ProfileContributionsCtrl', dependencies);
};