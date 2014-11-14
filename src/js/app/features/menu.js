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

  var setMenuState = function(isOpen, force, event) {
    // If the menu state is not to be changed, then just exit
    if (state.expanded === isOpen) {
      return;
    }

    $timeout.cancel(setMenuTimeout);

    // The delay for opening/closing
    var delay = isOpen ? 800 : 400;
    if (force) {
      delay = 0;
    }

    setMenuTimeout = $timeout(function() {
      if (isOpen) {
        openMenu();
      } else {
        closeMenu();
      }
    }, delay);

    if (event) {
      try {
        event.preventDefault();
        event.stopPropagation();
      } catch(e) {
        ;
      }
    }

    return false;
  };

  var toggleMenuState = function toggleMenuState() {
    setMenuState(!state.expanded, true);
  }

  return {
    setMenuState: setMenuState,
    toggleMenuState: toggleMenuState,
    state: state
  };
}])

.controller('MenuCtrl', ['$scope', '$state', '$rootScope', '$route', '$http', '$interval', '$timeout', 'Notification', '$idle', '$window', 'MenuService',
  function($scope, $state, $rootScope, $route, $http, $interval, $timeout, Notification, $idle, $window, MenuService) {

    // Query for notifications every set interval
    $scope.notifications = [];

    $scope.state = MenuService.state;

    var queryNotifications = function() {
      Notification.query({}, function(notifications) {
        $scope.notifications = notifications;
      });
    }

    queryNotifications();

    var notificationInterval;
    var startNotificationInterval = function() {
      // Cancel the notificationInterval if one exists already;
      if (notificationInterval) {
        $interval.cancel(notificationInterval);
      }
      notificationInterval = $interval(function() {
        if (!MenuService.state.expanded) {
          queryNotifications()
        }
      }, 10000);
    }
    // Bootstrap the notificationInterval
    startNotificationInterval();

    $scope.$on('$idleTimeout', function() {
      $interval.cancel(notificationInterval);
    })

    $scope.$on('$idleEnd', function() {
      startNotificationInterval();
      // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
    });

    $idle.watch();

    $scope.$watch('notifications', function() {
      var count = _.filter($scope.notifications, function(n) { return !n.read }).length;
      if (count > 0) {
        var title = count + ' new notification';
        if (count > 1) title += 's';
        $scope.notificationsTitle = title;
      } else {
        $scope.notificationsTitle = 'Notifications';
      }
      $scope.unreadCount = count > 0 ? count : '';
    }, true);

    $scope.setMenuState = MenuService.setMenuState;

    $scope.openSettings = function($event) {
      // Prevent bubbling to showItem.
      // On recent browsers, only $event.stopPropagation() is needed
      if ($event.stopPropagation) $event.stopPropagation();
      if ($event.preventDefault) $event.preventDefault();
      $event.cancelBubble = true;
      $event.returnValue = false;

      $state.go("user.settings", {community: $rootScope.community.slug, id: $rootScope.currentUser.id});
    }

    $scope.markread = function(notification) {
      notification.read = true;
      Notification.markRead({id: notification.id})
    }

  }])
.controller('globalMenuController', ['$scope', 'MenuService',
  function($scope, MenuService) {
    $scope.setMenuState = MenuService.setMenuState;
    $scope.toggleMenuState = MenuService.toggleMenuState;
  }]);
