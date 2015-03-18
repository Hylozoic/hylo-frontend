

var controller = function($scope, $analytics) {
  console.log("help");
};

module.exports = function(angularModule) {
  angularModule.controller('SupportCtrl', controller);
};