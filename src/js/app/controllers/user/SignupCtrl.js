var handleError = function(err, $scope, $analytics) {
  var msg = err.data, email = $scope.user.email;
  if (!msg) {
    $scope.signupError = "Couldn't sign up. Please try again.";
    Rollbar.error("Signup failure", {email: $scope.user.email});
    $analytics.eventTrack('Signup failure', {email: email, cause: 'unknown'});
    return;
  }

  if (msg.match(/Key.*already exists/)) {
    var match = msg.match(/Key \((.*)\)=\((.*)\) already exists/),
      key = match[1], value = match[2];

    $scope.signupError = format('The %s "%s" is already in use. Try logging in instead?', key, value);
    $analytics.eventTrack('Signup failure', {email: email, cause: 'duplicate ' + key});

  } else {
    $scope.signupError = msg;
    $analytics.eventTrack('Signup failure', {email: email, cause: msg});
  }
};

module.exports = function($scope, $analytics, User, Community, ThirdPartyAuth, Invitation, context, projectInvitation) {
  "ngInject";
  $analytics.eventTrack('Signup start');
  $scope.user = {};

  $scope.invitation = Invitation.storedData() || projectInvitation;

  $scope.submit = function(form) {
    form.submitted = true;
    $scope.signupError = null;
    if (form.$invalid) return;

    var params = _.merge({}, $scope.user, {login: true}, projectInvitation);

    User.signup(params).$promise.then(function(user) {
      $analytics.eventTrack('Signup success', {provider: 'password'});
      if (context === 'modal') {
        $scope.$close({action: 'finish'});
      } else {
        $scope.$state.go('appEntry');
      }
    }, function(err) {
      handleError(err, $scope, $analytics);
    });
  };

  $scope.useThirdPartyAuth = function(service, form) {
    $scope.authStarted = true;
    $scope.serviceUsed = service;
    $scope.authDialog = ThirdPartyAuth.openPopup(service);
  };

  $scope.finishThirdPartyAuth = function(error) {
    $scope.$apply(function() {
      $scope.authDialog.close();
      if (error) {
        handleError({data: error}, $scope, $analytics);
      } else {
        $analytics.eventTrack('Signup success', {provider: $scope.serviceUsed});
        $scope.$state.go('appEntry');
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

