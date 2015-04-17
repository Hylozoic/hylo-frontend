var format = require('util').format;

var controller = function($scope, $stateParams, User) {
  $scope.user = {};
  $scope.submit = function(form) {
    form.submitted = true;
    $scope.passwordLoginError = null;
    if (form.$invalid) return;

    User.login($scope.user).$promise.then(function() {
      console.log('yey');
    }, function(err) {
      var msg = err.data;
      if (!msg) {
        $scope.passwordLoginError = "Couldn't log in. Please try again.";
        Rollbar.error("Login failure", {email: $scope.user.email});
        return;
      }

      console.log(err);

      var noPasswordMatch = msg.match(/password account not found. available: \[(.*)\]/);
      if (noPasswordMatch) {
        var options = noPasswordMatch[1].split(',');
        $scope.passwordLoginError = format("Your account has no password set. Please log in with %s.",
          _.map(options, function(x) { return _.capitalize(x) }).join(' or '));

      } else if (msg === 'password does not match') {
        $scope.passwordLoginError = 'The password you entered is incorrect.';

      } else if (msg === 'email not found') {
        $scope.passwordLoginError = 'The email address you entered was not recognized.';

      }

    });
  };
};

module.exports = function(angularModule) {
  angularModule.controller('LoginCtrl', controller);
};