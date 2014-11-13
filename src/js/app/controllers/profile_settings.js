angular.module("hyloControllers").controller('ProfileSettingsCtrl', ['$rootScope', 'growl', '$analytics', '$modal', '$log', '$state',
  function($rootScope, growl, $analytics, $modal, $log, $state) {

    if (!$rootScope.settingsOpened) {
      var modalInstance = $modal.open({
        templateUrl: '/ui/app/profile_settings.tpl.html',
        controller: "ProfileSettingsModalCtrl",
        backdrop: 'static'
      });

      $rootScope.settingsOpened = true;

      var finishClosing = function() {
        $rootScope.settingsOpened = false;
        try {
          $state.go('^');
        } catch(e) {
          ;
        }
      }

      modalInstance.result.then(function (selectedItem) {
        finishClosing();
      });
    }

  }]);

angular.module("hyloControllers").controller('ProfileSettingsModalCtrl', ['$scope', '$modalInstance', '$window', '$rootScope', 'growl', '$http', '$analytics',
  function($scope, $modalInstance, $window, $rootScope, growl, $http, $analytics) {

    var previousSettingsEmail = "";
    var previousSettingsSendPref = "";
    var previousSettingsDigest = "";
    $analytics.eventTrack('Settings: User: Open User Preferences', {user_id: $rootScope.currentUser.id, user_email: $rootScope.currentUser.email});

    $scope.$watch('currentUser', function(user) {
      user.$promise.then(function(user) {
        $scope.user = user;

        $scope.hasPaidMembership = _.some($rootScope.currentUser.memberships, function(membership){ return membership.fee != "Free"});

        previousSettingsEmail = $rootScope.currentUser.email;
        previousSettingsSendPref = $rootScope.currentUser.sendEmailPreference;
        previousSettingsDigest = $rootScope.currentUser.dailyDigest;

        $scope.linkedAccounts = _.reject(user.linkedAccounts, function(x) { return x == 'password' });
      });
    });

    $scope.saveEmail = function() {
      if (previousSettingsEmail == $scope.user.email) {
        return;
      }

      if($window.confirm("By changing your email address, you will have to re-validate your email address before you can continue using Hylo.  Are you sure you want to continue?")) {
        $rootScope.currentUser.$savePrefs(function(u, putRespHeaders) {
          growl.addSuccessMessage("Email address successfully changed");
          $analytics.eventTrack('Settings: User: Updated Email Address');
        }, function(response) {
          if (response.data.error) {
            growl.addErrorMessage(response.data.error);
          }
          $rootScope.currentUser.email = previousSettingsEmail;
        });
      } else {
        $scope.user.email = previousSettingsEmail;
      }
    }

    $scope.savePrefs = function() {
      $rootScope.currentUser.$savePrefs(function(u) {
        growl.addSuccessMessage("Preferences successfully changed");
        $analytics.eventTrack('Settings: User: Save User Preferences', {user_id: u.id, user_email: u.email});
      }, function(response) {
        if (response.data.error) {
          growl.addErrorMessage(response.data.error);
        }
        $rootScope.currentUser.sendEmailPreference = previousSettingsSendPref;
        $rootScope.currentUser.dailyDigest = previousSettingsDigest;
      })
    }

    $scope.subview = null;

    $scope.deleteAccount = function() {
      if ($window.confirm("Are you sure ?")) {
        // do de-activate account.
      }
    }

    $scope.deactivate = function(communityId, communityName) {
      if ($window.confirm("Are you sure you wish to remove yourself from " + communityName + "?")) {
        $http.post("/community/deactivate",
            {
              cid: communityId
            }
        )
        $rootScope.currentUser.memberships = _.without($rootScope.currentUser.memberships, _.findWhere($rootScope.currentUser.memberships, {communityId: communityId}))
      }
    }

    $scope.ok = function () {
      // TODO Save the settings
      $modalInstance.close("Saved");
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);
