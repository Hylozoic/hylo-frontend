var controller = function($scope, $rootScope, Onboarding) {

  var onclick;

  $rootScope.$on('announcer:show', function(event, data) {
    onclick = data.onclick;
    $scope.text = data.text;
    $scope.className = data.className;
    $scope.active = true;
  });

  $rootScope.$on('announcer:hide', function() {
    $scope.active = false;
  })

  $scope.go = function() {
    $scope.active = false;
    if (typeof(onclick) === 'function')
      onclick();
  };
};

module.exports = function(angularModule) {
  angularModule.controller('AnnouncerCtrl', controller);
};