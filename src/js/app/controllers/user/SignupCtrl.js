var format = require('util').format;

var handleError = function(err, $scope, $analytics) {
  var msg = err.data, email = $scope.user.email;
  if (!msg) {
    $scope.signupError = "Couldn't sign up. Please try again.";
    Rollbar.error("Signup failure", {email: $scope.user.email});
    $analytics.eventTrack('Signup failure', {email: email, cause: 'unknown'});
    return;
  }

  if (msg === 'bad code') {
    $scope.signupError = 'The invitation code you entered is not valid.';
    $analytics.eventTrack('Signup failure', {email: email, cause: 'bad invitation code'});

  } else if (msg.match(/Key.*already exists/)) {
    var match = msg.match(/Key \((.*)\)=\((.*)\) already exists/),
      key = match[1], value = match[2];

    $scope.signupError = format('The %s "%s" is already in use. Try logging in instead?', key, value);
    $analytics.eventTrack('Signup failure', {email: email, cause: 'duplicate ' + key});

  } else {
    $scope.signupError = msg;
    $analytics.eventTrack('Signup failure', {email: email, cause: msg});
  }
};

var controller = function($scope, $analytics, User, Community, ThirdPartyAuth) {
  $scope.user = {};

  $scope.submit = function(form) {
    form.submitted = true;
    $scope.signupError = null;
    if (form.$invalid) return;

    User.signup(_.merge({}, $scope.user, {login: true}))
    .$promise.then(function(user) {
      $scope.$state.go('onboarding.start');
    }, function(err) {
      handleError(err, $scope, $analytics);
    });
  };

  $scope.validateCode = function(form) {
    $scope.authStarted = true;
    if (!_.isEmpty(form.code.$error)) return;

    Community.validate({
      column: 'beta_access_code',
      constraint: 'exists',
      value: form.code.$viewValue,
      store_value: true
    }, function(resp) {
      if (resp.exists) {
        $scope.validCode = true;
        $scope.signupError = null;
      } else {
        handleError({data: 'bad code'}, $scope, $analytics);
        $scope.validCode = false;
      }
    });
  };

  $scope.useThirdPartyAuth = function(service, form) {
    $scope.authStarted = true;
    if (!_.isEmpty(form.code.$error)) return;
    $scope.authDialog = ThirdPartyAuth.openPopup(service);
  };

  $scope.finishThirdPartyAuth = function(error) {
    $scope.authDialog.close();
    if (error) {
      $scope.$apply(function() {
        handleError({data: error}, $scope, $analytics);
      });
    } else {
      $scope.$state.go('onboarding.start');
    }

  };

};

module.exports = function(angularModule) {
  angularModule.controller('SignupCtrl', controller);
};