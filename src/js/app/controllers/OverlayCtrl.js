var controller = function($scope, $rootScope, $timeout) {

  $rootScope.$on('overlay:load', function(event, data) {
    // reset overlay in case we somehow navigate back to it
    // after it's been closed once
    $scope.overlay = null;
    $scope.hideOverlay = false;

    $timeout(function() {
      _.each(_.keys(data), function(key) {
        $scope[key] = data[key];
      });
    }, 0);
  });

};

module.exports = function(angularModule) {
  angularModule.controller('OverlayCtrl', controller);
};