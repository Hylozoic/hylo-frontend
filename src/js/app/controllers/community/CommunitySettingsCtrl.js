var filepickerUpload = require('../../services/filepickerUpload');

var controller = function ($scope, $history, $analytics, community, currentUser, growl) {

  $scope.community = community;
  $scope.settings = community.settings;

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
          if (FPError.code == 101) return;

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
    return community.members({autocomplete: search, limit: 5}).$promise;
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

};

module.exports = function(angularModule) {
  angularModule.controller("CommunitySettingsCtrl", controller);
};