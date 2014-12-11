var filepickerUpload = require('../services/filepickerUpload');

module.exports = function(angularModule) {

  angularModule.controller("CommunitySettingsCtrl", [
    "$scope", '$timeout', '$state', '$log', '$analytics', 'Community',
    function ($scope, $timeout, $state, $log, $analytics, Community) {

      $scope.close = function() {
        $state.go('community', {community: $scope.community.slug});
      };

      $scope.editing = {};
      $scope.edited = {};

      $scope.edit = function(field) {
        $scope.edited[field] = $scope.community[field];
        $scope.editing[field] = true;
      };

      $scope.cancelEdit = function(field) {
        $scope.editing[field] = false;
      };

      $scope.saveEdit = function(field) {
        $scope.editing[field] = false;
        var data = {id: $scope.community.id};
        data[field] = $scope.edited[field];
        Community.save(data, function() {
          $scope.community[field] = $scope.edited[field];
          $analytics.eventTrack('Community: Changed ' + field, {
            community_id: $scope.community.slug,
            moderator_id: $scope.currentUser.id
          });
        });
      };

      var imageChangeFn = function(opts) {
        return function() {
          filepickerUpload({
            path: opts.path,
            convert: opts.convert,
            success: function(url) {
              var data = {id: $scope.community.id};
              data[opts.fieldName] = url;
              Community.save(data, function() {
                $scope.community[opts.fieldName] = url;
                $analytics.eventTrack('Community: Changed ' + opts.humanName, {
                  community_id: $scope.community.slug,
                  moderator_id: $scope.currentUser.id
                });
              });
            },
            failure: function(error) {
              growl.addErrorMessage('An error occurred while uploading the image. Please try again.');
              $analytics.eventTrack('Community: Failed to Change ' + opts.humanName, {
                community_id: $scope.community.slug,
                moderator_id: $scope.currentUser.id
              });
            }
          });
        };
      }

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

      $scope.invite = function() {
        if ($scope.submitting) return;
        $scope.submitting = true;
        $scope.inviteResults = null;

        Community.invite({id: $scope.community.id, emails: $scope.emails, moderator: $scope.inviteAsModerator})
        .$promise.then(function(resp) {
          $scope.inviteResults = resp.results;
          $scope.emails = '';
          $scope.submitting = false;
        }, function() {
          alert('Something went wrong. Please check the emails you entered for typos.');
          $scope.submitting = false;
        });
      };

      $scope.toggleModerators = function() {
        $scope.expand3 = !$scope.expand3;
        if (!$scope.moderators) {
          $scope.moderators = $scope.community.moderators();
        }
      };

      $scope.removeModerator = function(userId) {
        var user = _.find($scope.moderators, function(user) { return user.id == userId }),
          confirmText = "Are you sure you wish to remove " + user.name + "'s moderator powers?";

        if (confirm(confirmText)) {
          $scope.community.removeModerator({user_id: userId}, function() {
            $scope.moderators = $scope.moderators.filter(function(user) {
              return user.id != userId;
            });
          });
        }
      };

      $scope.findMembers = function(search) {
        return $scope.community.members({search: search}).$promise;
      };

      $scope.addModerator = function(item, model, label) {
        $scope.selectedMember = null;
        $scope.community.addModerator({user_id: item.id}, function() {
          $scope.moderators.push(item);
        })
      }

    }
  ]);

};