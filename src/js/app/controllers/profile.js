var dependencies = ['$scope'];
dependencies.push(function($scope) {

});

module.exports = function(angularModule) {
  angularModule.controller('ProfileCtrl', dependencies);
};