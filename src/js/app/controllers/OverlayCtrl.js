var controller = function($scope, $rootScope, $timeout, Overlay) {

  $scope.showOverlay = false;

  var show = function(data) {
    $scope.overlay = data.overlay;

    // wait for ng-include to take effect
    $timeout(function() {
      // load arbitrary scope data
      _.each(_.keys(data), function(key) {
        if (key != 'overlay') $scope[key] = data[key];
      });

      $scope.showOverlay = true;
    });
  };

  var initialOverlayData = Overlay.storedData();
  if (initialOverlayData) {
    show(initialOverlayData);
    Overlay.resetData();
  }

  $rootScope.$on('overlay:load', function(event, data) {
    show(data);
  });

  $scope.hide = function () {
    $scope.showOverlay = false;
  };

};

module.exports = function(angularModule) {
  angularModule.controller('OverlayCtrl', controller);
};