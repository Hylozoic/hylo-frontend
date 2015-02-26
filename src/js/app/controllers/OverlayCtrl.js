var controller = function($scope, $rootScope, $timeout) {

  $scope.showOverlay = false;

  $rootScope.$on('overlay:load', function(event, data) {
    $scope.overlay = data.overlay;

    // wait for ng-include to take effect
    $timeout(function() {
      // load arbitrary scope data
      _.each(_.keys(data), function(key) {
        if (key != 'overlay') $scope[key] = data[key];
      });

      $scope.showOverlay = true;
    });
  });

  $scope.hide = function () {
    $scope.showOverlay = false;
  };

};

module.exports = function(angularModule) {
  angularModule.controller('OverlayCtrl', controller);
};