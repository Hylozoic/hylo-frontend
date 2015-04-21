var format = require('util').format;

var handleError = function(err, $scope, $analytics) {
  var msg = err.data;
  if (!msg) {
    $scope.passwordLoginError = "Couldn't log in. Please try again.";
    Rollbar.error("Login failure", {email: $scope.user.email});
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: 'unknown'});
    return;
  }

  var noPasswordMatch = msg.match(/password account not found. available: \[(.*)\]/);
  if (noPasswordMatch) {
    var options = noPasswordMatch[1].split(',');
    $scope.passwordLoginError = format("Your account has no password set. Please log in with %s.",
      _.map(options, function(x) { return _.capitalize(x) }).join(' or '));
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: 'non-password account'});

  } else if (msg === 'password does not match') {
    $scope.passwordLoginError = 'The password you entered is incorrect.';
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: 'bad password'});

  } else if (msg === 'email not found') {
    $scope.passwordLoginError = 'The email address you entered was not recognized.';
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: 'bad email'});

  } else {
    $scope.signupError = msg;
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: msg});
  }
};

var controller = function($scope, $stateParams, $analytics, User) {
  $scope.user = {};

  $scope.submit = function(form) {
    form.submitted = true;
    $scope.passwordLoginError = null;
    if (form.$invalid) return;

    User.login($scope.user).$promise.then(function() {
      if ($stateParams.next) {
        $scope.$state.go($stateParams.next.state, $stateParams.next.params);
      } else {
        $scope.$state.go('appEntry');
      }
    }, function(err) {
      handleError(err, $scope, $analytics);
    });
  };
};

module.exports = function(angularModule) {
  angularModule.controller('LoginCtrl', controller);
};