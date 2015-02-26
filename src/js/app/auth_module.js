angular.module('hylo-auth-module', ['http-auth-interceptor'])
.directive('hyloAuth', function($timeout) {
  return {
    restrict: 'A',
    link: function($scope, $elem, $attrs) {
      //once Angular is started, remove class:
      $elem.removeClass('waiting-for-angular');

      $scope.loggedIn = true;

      $scope.$on('event:auth-loginRequired', function() {
        $timeout(function() {
          window.location.replace("/login");
        }, 3000);

        $scope.loggedIn = false;
      });

      $scope.$on('event:auth-loginConfirmed', function() {
        $scope.loggedIn = true;
      });
    }
  }
});