angular.module("hylo.menu", []).factory('MenuService', ['$timeout', "$window", function($timeout, $window) {
  var setMenuTimeout;

  var state = {
    expanded: false,
    membershipsExpanded: false
  }

  var openMenu = function openMenu() {
    state.expanded = true;
  }

  var closeMenu = function closeMenu() {
    state.expanded = false;
    state.membershipsExpanded = false;
  }

  var setMenuState = function(isOpen, immediate, event) {
    // If the menu state is not to be changed, then just exit
    if (state.expanded === isOpen) {
      return;
    }

    $timeout.cancel(setMenuTimeout);

    if (immediate) {
      isOpen ? openMenu() : closeMenu();
    } else {
      setMenuTimeout = $timeout(function() {
        isOpen ? openMenu() : closeMenu();
      }, (isOpen ? 800 : 400));
    }

    if (event) {
      try {
        event.preventDefault();
        event.stopPropagation();
      } catch(e) {}
    }

    return false;
  };

  return {
    state: state,
    setMenuState: setMenuState,
    toggleMenuState: function() {
      setMenuState(!state.expanded, true);
    },
    keepMenuOpen: function() {
      $timeout.cancel(setMenuTimeout);
    }
  };
}])

.controller('MenuCtrl', ['$scope', '$state', '$timeout', 'MenuService',
  function($scope, $state, $timeout, MenuService) {

    $scope.state = MenuService.state;
    $scope.setMenuState = MenuService.setMenuState;
    $scope.keepMenuOpen = MenuService.keepMenuOpen;

  }])

.controller("MobileMenuCtrl", ['$scope', 'MenuService', function($scope, MenuService) {
  $scope.toggleMenuState = MenuService.toggleMenuState;
}]);