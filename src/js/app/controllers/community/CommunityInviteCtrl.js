var controller = function($scope, $analytics, community, extraProperties, $history, $location) {
  $scope.community = community

  _.merge(community, extraProperties)
  var origin = $location.absUrl().replace($location.path(), '')
  $scope.join_url = origin + '/c/' + community.slug + '/join/' + community.beta_access_code

  $scope.invitationSubject = format("Join %s on Hylo", community.name)

  $scope.invitationText = format("%s is using Hylo, a new kind of social network " +
    "that's designed to help communities and organizations create things together.\n\n" +
    "We're surrounded by incredible people, skills, and resources. But it can be hard to know whom " +
    "to connect with, for what, and when. Often the things we need most are closer than we think.\n\n" +
    "Hylo makes it easy to discover the abundant skills, resources, and opportunities in your communities " +
    "that might otherwise go unnoticed. Together, we can create whatever we can imagine.",
    community.name);

  $scope.invite = function() {
    if ($scope.submitting) return;
    $scope.submitting = true;
    $scope.inviteResults = null;

    community.invite({
      emails: $scope.emails,
      subject: $scope.invitationSubject,
      message: $scope.invitationText,
      moderator: $scope.inviteAsModerator
    })
    .$promise.then(function(resp) {
      $analytics.eventTrack('Invite Members', {email_addresses: $scope.emails, to_moderate: $scope.inviteAsModerator});
      $scope.inviteResults = resp.results;
      $scope.emails = '';
      $scope.submitting = false;
    }, function() {
      alert('Something went wrong. Please check the emails you entered for typos.');
      $analytics.eventTrack('Inviting Members Failed', {email_addresses: $scope.emails});
      $scope.submitting = false;
    });
  };

  $scope.close = function () {
    if ($history.isEmpty()) {
      $scope.$state.go('community.members', {community: community.slug});
    } else {
      $history.back();
    }
  };

};

module.exports = function (angularModule) {
  angularModule.controller('CommunityInviteCtrl', controller);
}
