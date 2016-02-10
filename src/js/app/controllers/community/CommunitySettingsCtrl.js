var filepickerUpload = require('../../services/filepickerUpload');

var controller = function ($scope, $history, $analytics, community, currentUser, growl, extraProperties, User, $location) {

  _.merge(community, extraProperties);
  var origin = $location.absUrl().replace($location.path(), '');
  $scope.join_url = origin + '/c/' + community.slug + '/join/' + community.beta_access_code;
  $scope.add_slack_url = origin + '/noo/community/' + community.id + '/settings/slack';
  $scope.community = community;
  $scope.settings = community.settings;

  if ($location.$$search.slack === "1") {
    growl.addSuccessMessage('Success connecting to Slack.');
  } else if ($location.$$search.slack === "0") {
    growl.addErrorMessage('There was an error connecting to Slack. Please try again.');
  }

  $scope.close = function() {
    if ($history.isEmpty()) {
      $scope.$state.go('community.posts', {community: community.slug});
    } else {
      $history.back();
    }
  };

  $scope.editing = {};
  $scope.edited = {};

  $scope.edit = function(field, field2) {
    $scope.edited[field] = community[field];
    $scope.editing[field] = true;

    if (field2) {
      $scope.edited[field2] = community[field2];
      $scope.editing[field2] = true;
    }
  };

  $scope.cancelEdit = function(field, field2) {
    $scope.editing[field] = false;

    if (field2) {
      $scope.editing[field2] = false;
    }
  };

  $scope.saveEdit = function(field, field2) {
    $scope.editing[field] = false;
    var data = {};

    data[field] = $scope.edited[field];

    if (field2 === 'leader') {
      data.leader_id = $scope.edited.leader.id;
    }

    community.update(data, function() {
      community[field] = $scope.edited[field];
      if (field2) {
        community[field2] = $scope.edited[field2];
      }
      $scope.join_url = origin + '/c/' + community.slug + '/join/' + community.beta_access_code;
      $analytics.eventTrack('Community: Changed Setting', {
        name: field,
        community_id: community.slug,
        moderator_id: currentUser.id
      });
    });
  };

  var imageChangeFn = function(opts) {
    return function() {
      $scope.editing[opts.fieldName] = true;
      filepickerUpload({
        path: opts.path,
        convert: opts.convert,
        success: function(url) {
          var data = {id: community.id};
          data[opts.fieldName] = url;
          community.update(data, function() {
            community[opts.fieldName] = url;
            $scope.editing[opts.fieldName] = false;
            $analytics.eventTrack('Community: Changed ' + opts.humanName, {
              community_id: community.slug,
              moderator_id: currentUser.id
            });
          });
        },
        failure: function(error) {
          $scope.editing[opts.fieldName] = false;
          $scope.$apply();
          if (error.code == 101) return;

          growl.addErrorMessage('An error occurred while uploading the image. Please try again.');
          $analytics.eventTrack('Community: Failed to Change ' + opts.humanName, {
            community_id: community.slug,
            moderator_id: currentUser.id
          });
        }
      });
    };
  };

  $scope.changeIcon = imageChangeFn(community.avatarUploadSettings());
  $scope.changeBanner = imageChangeFn(community.bannerUploadSettings());

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
    return User.autocomplete({q: search, communityId: community.id}).$promise;
  };

  $scope.addModerator = function(item, model, label) {
    $scope.selectedMember = null;
    community.addModerator({userId: item.id}, function() {
      $scope.moderators.push(item);
      $analytics.eventTrack('Make Moderator', {user_id: item.id, user_name: item.name});
    })
  };

  $scope.setLeader = function(item) {
    $scope.edited.leader = item;
  };

  $scope.removeSlackhook = function() {
    $scope.slack_configure = community.slack_configure;
    community.update({slack_hook: "", slack_team: "", slack_configure: ""}, function() {
      community.slack_hook = "";
      community.slack_team = "";
      community.slack_configure = "";
      $scope.slack_remove_transition = true;
    });
  };

  $scope.removeFromSlack = function() {
    $scope.slack_remove_transition = false;
    var win = window.open($scope.slack_configure, '_blank');
    win.focus();
    $scope.slack_configure = null;
  }
};

module.exports = function(angularModule) {
  angularModule.controller("CommunitySettingsCtrl", controller);
};
