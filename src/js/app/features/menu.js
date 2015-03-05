var factory = function($timeout) {
  var menuTimeout, open = false, membershipsShown = false;

  var openMenu = function openMenu() {
    open = true;
  }

  var closeMenu = function closeMenu() {
    open = false;
    membershipsShown = false;
  }

  var setState = function(shouldOpen, immediate, event) {
    // If the menu state is not to be changed, then just exit
    if (open === shouldOpen)
      return;

    $timeout.cancel(menuTimeout);

    if (immediate) {
      shouldOpen ? openMenu() : closeMenu();
    } else {
      menuTimeout = $timeout(function() {
        shouldOpen ? openMenu() : closeMenu();
      }, (shouldOpen ? 800 : 400));
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
    keepOpen: function() {
      $timeout.cancel(menuTimeout);
    },
    isOpen: function() {
      return open;
    },
    open: function() {
      return setState(true, true);
    },
    toggle: function() {
      return setState(!open, true);
    },
    closeSoon: function() {
      return setState(false);
    },
    toggleMemberships: function() {
      membershipsShown = !membershipsShown;
    },
    areMembershipsShown: function() {
      return membershipsShown;
    }
  };
};

var run = function($rootScope, Menu) {
  $rootScope.$on('$stateChangeStart', function() {
    Menu.closeSoon();
  });
};

module.exports = function(angularModule) {
  angularModule.factory('Menu', factory).run(run);
};