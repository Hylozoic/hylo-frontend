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

var controller = function($scope, $analytics, User, Community) {
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

  $scope.useService = function(service, form) {
    $scope.usingService = true;
    if (!_.isEmpty(form.code.$error)) return;

    // validate community code
    Community.validate({
      column: 'beta_access_code',
      constraint: 'exists',
      value: form.code.$modelValue
    }, function(resp) {
      if (!resp.exists) {
        handleError({data: 'bad code'}, $scope, $analytics);
        return;
      }

      openPopup(service);
    });

  };

  var openPopup = function(service) {
    // vertical positioning is ignored... wonder why

    if (service === 'google') {
      var width = 420,
        height = 480,
        left = document.documentElement.clientWidth/2 - width/2,
        top = document.documentElement.clientHeight/2 - height/2;

      $scope.authDialog = window.open(
        '/noo/login/google',
        'googleAuth',
        format('width=%s, height=%s, titlebar=no, toolbar=no, menubar=no, left=%s, top=%s', width, height, left, top)
      );
    }
  };

  $scope.finishServiceSignup = function() {
    $scope.authDialog.close();
    $scope.$state.go('appEntry');
  };

};

module.exports = function(angularModule) {
  angularModule.controller('SignupCtrl', controller);
};