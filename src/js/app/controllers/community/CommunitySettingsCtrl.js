var filepickerUpload = require('../../services/filepickerUpload'),
  format = require('util').format;

var controller = function ($scope, $timeout, $state, $log, $analytics, community, currentUser, growl) {

  $scope.community = community;
  $scope.settings = community.settings;

  $scope.close = function() {
    $state.go('community.seeds', {community: community.slug});
  };

  $scope.editing = {};
  $scope.edited = {};

  $scope.edit = function(field) {
    $scope.edited[field] = community[field];
    $scope.editing[field] = true;
  };

  $scope.cancelEdit = function(field) {
    $scope.editing[field] = false;
  };

  $scope.saveEdit = function(field) {
    $scope.editing[field] = false;
    var data = {};
    data[field] = $scope.edited[field];
    community.update(data, function() {
      community[field] = $scope.edited[field];
      $analytics.eventTrack('Community: Changed Setting', {
        name: field,
        community_id: community.slug,
        moderator_id: currentUser.id
      });
    });
  };

  var imageChangeFn = function(opts) {
    return function() {
      filepickerUpload({
        path: opts.path,
        convert: opts.convert,
        success: function(url) {
          var data = {id: community.id};
          data[opts.fieldName] = url;
          community.update(data, function() {
            community[opts.fieldName] = url;
            $analytics.eventTrack('Community: Changed ' + opts.humanName, {
              community_id: community.slug,
              moderator_id: currentUser.id
            });
          });
        },
        failure: function(error) {
          growl.addErrorMessage('An error occurred while uploading the image. Please try again.');
          $analytics.eventTrack('Community: Failed to Change ' + opts.humanName, {
            community_id: community.slug,
            moderator_id: currentUser.id
          });
        }
      });
    };
  };

  $scope.changeIcon = imageChangeFn({
    fieldName: 'avatar_url',
    humanName: 'Icon',
    path: 'communityIcon',
    convert: {width: 160, fit: 'clip', rotate: "exif"}
  });

  $scope.changeBanner = imageChangeFn({
    fieldName: 'banner_url',
    humanName: 'Banner',
    path: 'communityBanner',
    convert: {width: 1600, format: 'jpg', fit: 'max', rotate: "exif"}
  });

  $scope.invitationSubject = format("Join %s on Hylo", community.name);

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

  $scope.toggleModerators = function() {
    $scope.expand3 = !$scope.expand3;
    if (!$scope.moderators) {
      $scope.moderators = community.moderators();
    }
  };

  $scope.saveSetting = function(name) {
    community.update({settings: community.settings}, function() {
      $analytics.eventTrack('Community: Changed Setting', {
        name: name,
        community_id: community.slug,
        moderator_id: currentUser.id
      });
      growl.addSuccessMessage('Changes were saved.');
    });
  };

  $scope.removeModerator = function(userId) {
    var user = _.find($scope.moderators, function(user) { return user.id == userId }),
      confirmText = "Are you sure you wish to remove " + user.name + "'s moderator powers?";

    if (confirm(confirmText)) {
      community.removeModerator({userId: userId}, function() {
        $scope.moderators = $scope.moderators.filter(function(user) {
          return user.id != userId;
        });
      });
    }
  };

  $scope.findMembers = function(search) {
    return community.members({search: search}).$promise;
  };

  $scope.addModerator = function(item, model, label) {
    $scope.selectedMember = null;
    community.addModerator({userId: item.id}, function() {
      $scope.moderators.push(item);
      $analytics.eventTrack('Make Moderator', {user_id: item.id, user_name: item.name});
    })
  };

};

module.exports = function(angularModule) {
  angularModule.controller("CommunitySettingsCtrl", controller);
};