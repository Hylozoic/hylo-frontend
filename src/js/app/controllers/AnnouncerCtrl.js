var controller = function($scope, $rootScope, Onboarding) {

  var onclick;

  $rootScope.$on('announce', function(event, data) {
    onclick = data.onclick;
    $scope.text = data.text;
    $scope.active = true;
  });

  $scope.go = function() {
    $scope.active = false;
    if (typeof(onclick) === 'function')
      onclick();
  };
};

module.exports = function(angularModule) {
  angularModule.controller('AnnouncerCtrl', controller);
};