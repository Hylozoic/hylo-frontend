angular.module('hylo-auth-module', ['http-auth-interceptor'])
.directive('hyloAuth', function($timeout, $rootScope) {
  return {
    restrict: 'A',
    link: function($scope, $elem, $attrs) {
      //once Angular is started, remove class:
      $elem.removeClass('waiting-for-angular');

      $scope.$on('event:auth-loginRequired', function() {
        window.location = "/login?next=" + location.pathname;
      });

      $scope.$on('event:auth-loginConfirmed', function() {
        $rootScope.loggedIn = true;
      });
    }
  }
});