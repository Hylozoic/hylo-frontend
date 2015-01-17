var filepickerUpload = require('../../services/filepickerUpload');

// the newCurrentUser dependency will change once the rest of
// the app is switched over to using the new User API
var dependencies = ['$scope', '$analytics', 'newCurrentUser', 'growl'];
dependencies.push(function($scope, $analytics, newCurrentUser, growl) {
  var user = $scope.user = newCurrentUser,
    editData = $scope.editData = _.pick(user, [
      'bio', 'skills', 'organizations', 'avatar_url', 'banner_url',
      'twitter_name', 'linkedin_url', 'facebook_url'
    ]),
    edited = {};

  $scope.save = function() {
    if (editData.banner_url === require('../../services/defaultUserBanner')) {
      editData.banner_url = null;
    }

    var saveData = _.clone(editData);
    if (!edited.skills) delete saveData.skills;
    if (!edited.organizations) delete saveData.organizations;

    user.update(saveData, function() {
      _.extend(user, saveData);
      $scope.cancel();
    });
  };

  $scope.cancel = function() {
    $scope.$state.go('profile.seeds', {id: user.id});
  };

  $scope.add = function(event, type) {
    if (event.which == 13) {
      editData[type].unshift(event.target.value);
      event.target.value = '';
      edited[type] = true;
    }
    return true;
  };

  $scope.remove = function(value, type) {
    editData[type].splice(editData[type].indexOf(value), 1);
    edited[type] = true;
  };

  var imageChangeFn = function(opts) {
    return function() {
      filepickerUpload({
        path: opts.path,
        convert: opts.convert,
        success: function(url) {
          editData[opts.fieldName] = url;
          $analytics.eventTrack('Profile: Changed ' + opts.humanName, {user_id: user.id});
        },
        failure: function(error) {
          growl.addErrorMessage('An error occurred while uploading the image. Please try again.');
          $analytics.eventTrack('Profile: Failed to Change ' + opts.humanName, {user_id: user.id});
        }
      });
    };
  };

  $scope.changeAvatar = imageChangeFn({
    fieldName: 'avatar_url',
    humanName: 'Icon',
    path: 'thumb',
    convert: {width: 200, height: 200, fit: 'clip', rotate: "exif"}
  });

  $scope.changeBanner = imageChangeFn({
    fieldName: 'banner_url',
    humanName: 'Banner',
    path: 'userBanner',
    convert: {width: 1600, format: 'jpg', fit: 'max', rotate: "exif"}
  });

  $scope.changeTwitter = function() {
    var response = prompt(
      'Enter your Twitter username, or leave blank:',
      editData.twitter_name
    );
    if (response) editData.twitter_name = response;
  };

  $scope.changeFacebook = function() {
    if (editData.facebook_url) {
      if (confirm('Choose OK to remove your Facebook information.')) {
        editData.facebook_url = null;
      }
    } else {
      FB.login(function() {
        FB.api('/me', function(resp) {
          editData.facebook_url = resp.link;
        })
      })
    }
  };

  $scope.changeLinkedin = function() {
    if (editData.linkedin_url) {
      if (confirm('Choose OK to remove your LinkedIn information.')) {
        editData.linkedin_url = null;
      }
    } else {
      var left = document.documentElement.clientWidth/2 - 520/2;
      $scope.linkedinDialog = window.open('/noo/linkedin/authorize', 'linkedinAuth',
        'width=400, height=625, titlebar=no, toolbar=no, menubar=no, left=' + left);
    }
  };

  $scope.finishLinkedinChange = function(url) {
    editData.linkedin_url = url;
    $scope.linkedinDialog.close();
  };

});

module.exports = function(angularModule) {
  angularModule.controller('ProfileEditCtrl', dependencies);
};
