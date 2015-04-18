var format = require('util').format;

var handleError = function(err, $scope, $analytics) {
  var msg = err.data;
  if (!msg) {
    $scope.signupError = "Couldn't log in. Please try again.";
    Rollbar.error("Signup failure", {email: $scope.user.email});
    $analytics.eventTrack('Signup failure', {email: $scope.user.email, cause: 'unknown'});
    return;
  }

  if (msg === 'bad code') {
    $scope.signupError = 'The invitation code you entered is not valid.';
  } else if (msg.match(/Key.*already exists/)) {
    var match = msg.match(/Key \((.*)\)=\((.*)\) already exists/),
      key = match[1], value = match[2];

    $scope.signupError = format('The %s "%s" is already in use. Try logging in instead?', key, value);
  } else {
    $scope.signupError = msg;
  }
};

var controller = function($scope, User, $analytics) {
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
};

module.exports = function(angularModule) {
  angularModule.controller('SignupCtrl', controller);
};