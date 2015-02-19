angular.module('hylo-auth-module', ['http-auth-interceptor'])
/**
 * This directive will find itself inside HTML as a class,
 * and will remove that class, so CSS will remove loading image and show app content.
 * It is also responsible for showing/hiding login form.
 */
.directive('hyloAuth', ['$timeout', function($timeout) {
  return {
    restrict: 'C',
    link: function($scope, $elem, $attrs) {
      //once Angular is started, remove class:
      $elem.removeClass('waiting-for-angular');

      $scope.loginMode = false;

      $scope.$on('event:auth-loginRequired', function() {
        $timeout(function() {
          window.location.replace("/login");
        }, 3000);

        $scope.loginMode = true;
      });
      $scope.$on('event:auth-loginConfirmed', function() {
        $scope.loginMode = false;
      });
    }
  }
}]);
