var addrs = require('email-addresses');

module.exports = function($scope, growl, project, User) {
  "ngInject";

  $scope.close = function() {
    if ($history.isEmpty()) {
      $scope.$state.go('project', {slug: project.slug});
    } else {
      $history.go(-1);
    }
  };

  $scope.findMembers = function(search) {
    return User.autocomplete({q: search}).$promise;
  };

  $scope.subject = format('Join my project "%s" on Hylo', project.title);
  $scope.message = format("I would like your help on a project I'm starting:\n\n" +
    "%s\n%s\n\nYou can help make it happen!",
    project.title, project.intention);

  var parsedEmails = function() {
    var emailString = ($scope.emails || '').trim();
    if (emailString === '') return [];

    return _.map(emailString.split(','), function(email) {
      return email.trim();
    });
  };

  var validate = function() {
    var errors = [];
    _.map(parsedEmails(), function(email) {
      if (!addrs(email)) {
        errors.push(format('"%s" is not a valid email address.', email));
      }
    });

    if (errors.length > 0) {
      $scope.errors = errors;
      return false;
    }

    $scope.errors = null;
    return true;
  };

  $scope.send = function() {
    if (!validate()) return;
    $scope.sending = true;

    project.invite({
      subject: $scope.subject,
      message: $scope.message,
      users: _.map($scope.users, function(u) { return u.id }),
      emails: parsedEmails()
    }, function(resp) {
      $scope.sending = false;
      $scope.close();
      var count = $scope.users.length + parsedEmails().length;
      growl.addSuccessMessage(format('Sent %s invitation%s.', count, count === 1 ? '' : 's'));
    }, function() {
      $scope.sending = false;
    });
  };

}