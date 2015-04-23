var format = require('util').format;

var handleError = function(err, $scope, $analytics) {
  var msg = err.data;
  if (!msg) {
    $scope.loginError = "Couldn't log in. Please try again.";
    Rollbar.error("Login failure", {email: $scope.user.email});
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: 'unknown'});
    return;
  }

  var noPasswordMatch = msg.match(/password account not found. available: \[(.*)\]/);
  if (noPasswordMatch) {
    var options = noPasswordMatch[1].split(',');
    $scope.loginError = format("Your account has no password set. Please log in with %s.",
      _.map(options, function(x) { return _.capitalize(x) }).join(' or '));
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: 'non-password account'});

  } else if (msg === 'password does not match') {
    $scope.loginError = 'The password you entered is incorrect.';
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: 'bad password'});

  } else if (msg === 'email not found') {
    $scope.loginError = 'The email address you entered was not recognized.';
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: 'bad email'});

  } else if (msg === 'no community') {
    $scope.loginError = 'You are not a member of any community yet. Please sign up first.';
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: 'no community'});

  } else {
    $scope.signupError = msg;
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: msg});
  }
};

var finishLogin = function($scope, $stateParams) {
  if ($stateParams.next) {
    $scope.$apply(function() {
      history.pushState(null, null, $stateParams.next);
    });
  } else {
    $scope.$state.go('appEntry');
  }
}

var controller = function($scope, $stateParams, $analytics, User, ThirdPartyAuth) {
  $scope.user = {};

  $scope.submit = function(form) {
    form.submitted = true;
    $scope.loginError = null;
    if (form.$invalid) return;

    User.login($scope.user).$promise.then(function() {
      finishLogin($scope, $stateParams);
    }, function(err) {
      handleError(err, $scope, $analytics);
    });
  };

  $scope.useThirdPartyAuth = function(service) {
    $scope.authDialog = ThirdPartyAuth.openPopup(service);
  };

  $scope.finishThirdPartyAuth = function(error) {
    $scope.authDialog.close();
    if (error) {
      handleError({data: error}, $scope, $analytics);
      $scope.$apply();
    } else {
      finishLogin($scope, $stateParams);
    }
  };
};

module.exports = function(angularModule) {
  angularModule.controller('LoginCtrl', controller);
};