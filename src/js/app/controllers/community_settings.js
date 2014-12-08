var filepickerUpload = function(opts) {
  var pickOptions = {
    mimetype: 'image/*',
    multiple: false,
    services: ['COMPUTER', 'FACEBOOK', 'WEBCAM', 'GOOGLE_DRIVE', 'DROPBOX', 'INSTAGRAM', 'FLICKR', 'URL'],
    folders: false
  };

  var storeOptions = {
    location: 'S3',
    container: hyloEnv.s3.bucket,
    path: 'orig/',
    access: 'public'
  };

  var convert = function(blobs) {
    var blob = blobs[0],
      convertStoreOptions = $.extend(storeOptions, {path: opts.path + blob.key.substring(5)});

    filepicker.convert(blob, opts.convert, convertStoreOptions, function(newBlob) {
      opts.success(hyloEnv.s3.cloudfrontHost + '/' + newBlob.key);
    }, opts.failure)
  };

  filepicker.pickAndStore(pickOptions, storeOptions, convert, opts.failure);
};

module.exports = function(angularModule) {

  angularModule.controller("CommunitySettingsCtrl", [
    "$scope", '$timeout', '$state', '$log', '$analytics', 'Community',
    function ($scope, $timeout, $state, $log, $analytics, Community) {

      $scope.close = function() {
        window.history.back();
      };

      $scope.changeIcon = function() {
        filepickerUpload({
          path: 'communityIcon',
          convert: {
            width: 160,
            fit: 'clip',
            rotate: "exif"
          },
          success: function(url) {
            Community.save({
              id: $scope.community.id,
              avatar_url: url
            }, function() {
              $scope.community.avatar = url;
              $analytics.eventTrack('Community: Changed Icon', {
                community_id: $scope.community.slug,
                moderator_id: $scope.currentUser.id
              });
            });
          },
          failure: function(error) {
            growl.addErrorMessage('An error occurred while uploading the image. Please try again.');
            $analytics.eventTrack('Community: Failed to Change Icon', {
              community_id: $scope.community.slug,
              moderator_id: $scope.currentUser.id
            });
          }
        });
      };

      $scope.changeBanner = function() {
        filepickerUpload({
          path: 'communityBanner',
          convert: {
            width: 1600,
            format: 'jpg',
            fit: 'max',
            rotate: "exif"
          },
          success: function(url) {
            Community.save({
              id: $scope.community.id,
              banner_url: url
            }, function() {
              $scope.community.banner = url;
              $analytics.eventTrack('Community: Changed Banner', {
                community_id: $scope.community.slug,
                moderator_id: $scope.currentUser.id
              });
            });
          },
          failure: function(error) {
            growl.addErrorMessage('An error occurred while uploading the image. Please try again.');
            $analytics.eventTrack('Community: Failed to Change Banner', {
              community_id: $scope.community.slug,
              moderator_id: $scope.currentUser.id
            });
          }
        });
      };

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

    }
  ]);

};