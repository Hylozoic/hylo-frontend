module.exports = function($stateProvider) {

  $stateProvider
  .state('appEntry', /*@ngInject*/ {
    parent: 'main',
    url: '/app',
    onEnter: function(currentUser, $state, $timeout, onboarding) {
      var membership = (currentUser && currentUser.memberships[0]);
      if (membership) {
        $timeout(function() {
          $state.go('community.seeds', {community: membership.community.slug});
        });
      } else if (currentUser) {
        $timeout(function() {
          $state.go('home.allSeeds');
          Rollbar.error('User without community', {user_id: currentUser.id});
        });
      } else {
        $timeout(function() {
          $state.go('login');
        })
      }
    }
  })
  .state('entrance', /*@ngInject*/ {
    abstract: true,
    resolve: {
      loggedIn: function(User, $timeout, $state) {
        return User.status().$promise.then(function(res) {
          return res.signedIn;
        });
      },
      context: function() { return 'normal' },
      projectInvitation: function() { return null }
    },
    onEnter: function(loggedIn, $timeout, $state) {
      if (loggedIn) {
        $timeout(function() {
          $state.go('appEntry');
        });
      } else {
        window.hyloEnv.provideUser(null);
      }
    },
    templateUrl: '/ui/entrance/base.tpl.html'
  })
  .state('login', {
    url: '/h/login?next',
    parent: 'entrance',
    views: {
      entrance: {
        templateUrl: '/ui/entrance/login.tpl.html',
        controller: 'LoginCtrl'
      }
    }
  })
  .state('presignup', {
    url: '/h/start-signup',
    parent: 'entrance',
    views: {
      entrance: {
        templateUrl: '/ui/entrance/presignup.tpl.html',
        controller: function($scope) {
          'ngInject';
        }
      }
    }
  })
  .state('signup', {
    url: '/h/signup',
    parent: 'entrance',
    views: {
      entrance: {
        templateUrl: '/ui/entrance/signup.tpl.html',
        controller: 'SignupCtrl'
      }
    }
  })
  .state('waitlist', {
    url: '/h/waitlist',
    parent: 'entrance',
    views: {
      entrance: {
        templateUrl: '/ui/entrance/waitlist.tpl.html',
        controller: function($scope, $http) {
          'ngInject';

          $scope.request = {};

          $scope.submit = function(form) {
            form.submitted = true;
            if (form.$invalid) return;

            $http({
              method: 'POST',
              url: '/noo/waitlist',
              data: $scope.request
            }).success(function() {
              $scope.success = "Thank you for contacting us! We'll get back to you soon.";
            });
          };

        }
      }
    }
  })
  .state('forgotPassword', {
    url: '/h/forgot-password',
    parent: 'entrance',
    views: {
      entrance: {
        templateUrl: '/ui/entrance/forgot-password.tpl.html',
        controller: 'ForgotPasswordCtrl'
      }
    }
  })
  .state('useInvitation', /*@ngInject*/{
    url: '/h/use-invitation?token',
    templateUrl: '/ui/user/use-invitation.tpl.html',
    controller: function($scope, Invitation, $stateParams, $state) {
      Invitation.use({token: $stateParams.token}, function(resp) {
        if (resp.error) {
          $scope.error = resp.error;
        } else if (resp.signup) {
          Invitation.store(resp);
          $state.go('signup');
        } else {
          $state.go('appEntry');
        }
      });
    }
  });

};