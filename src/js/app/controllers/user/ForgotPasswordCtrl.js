var controller = function($scope, $analytics, User, context) {
  $analytics.eventTrack('Password reset start');

  $scope.submit = function(form) {
    form.submitted = true;
    $scope.error = null;
    if (form.$invalid) return;

    User.requestPasswordChange({email: $scope.email}, function(resp) {
      if (!resp.error) {
        $analytics.eventTrack('Password reset success', {email: $scope.email});
        $scope.success = "Please click the link in the email that we just sent you.";
      } else if (resp.error === 'no user') {
        $analytics.eventTrack('Password reset failure', {email: $scope.email});
        $scope.error = 'The email address you entered was not recognized.';
      }
    });
  };

  $scope.go = function(state) {
    if (context === 'modal') {
      $scope.$close({action: 'go', state: state});
    } else {
      $scope.$state.go(state);
    }
  };

};

module.exports = function(angularModule) {
  angularModule.controller('ForgotPasswordCtrl', controller);
};