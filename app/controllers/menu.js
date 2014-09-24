angular.module("hyloControllers").controller('MenuCtrl', ['$scope', '$state', '$rootScope', '$route', '$http', '$interval', '$timeout', 'Notification', '$idle', '$window',
  function($scope, $state, $rootScope, $route, $http, $interval, $timeout, Notification, $idle, $window) {

    // Query for notifications every set interval
    $scope.notifications = [];

    $scope.membershipsExpanded = false;

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
        if (!$scope.expanded) {
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


    $scope.expanded = false;

    var openMenu = function() {
      $scope.expanded = true;
      $timeout.cancel(toggleMenuPromise);
      $($window).on("click.menuCloseHandler", function (event) {
        closeMenuOnOutsideClick(event, function() {
          $scope.closeMenu();
          $scope.$apply();
        });
      });
    }

    $scope.closeMenu = function() {
      $timeout.cancel(toggleMenuPromise);
      $scope.expanded = false;
      $scope.membershipsExpanded = false;
      $($window).off("click.menuCloseHandler");
    }

    $scope.toggleMenu = function() {
      $scope.toggleMenuState(!$scope.expanded, true)
    };

    var toggleMenuPromise;
    $scope.toggleMenuState = function(state, force) {
      $timeout.cancel(toggleMenuPromise);

      // The delay for opening/closing
      var delay = state ? 800 : 400;
      if (force) {
        delay = 0;
      }

      toggleMenuPromise = $timeout(function() {
        if (state) {
          openMenu();
        } else {
          $scope.closeMenu();
        }
      }, delay);
    };

    function closeMenuOnOutsideClick(event, callbackOnClose) {

      var clickedElement = event.target;

      if (!clickedElement) return;

      var clickedOnMenu = $(clickedElement).closest('.menu').length > 0

      if (!clickedOnMenu) {
        callbackOnClose();
        return;
      }
    }

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

  }]);
