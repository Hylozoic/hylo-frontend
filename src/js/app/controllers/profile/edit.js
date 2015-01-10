var filepickerUpload = require('../../services/filepickerUpload');

// the newCurrentUser dependency will change once the rest of
// the app is switched over to using the new User API
var dependencies = ['$scope', '$analytics', 'newCurrentUser'];
dependencies.push(function($scope, $analytics, newCurrentUser) {
  var user = $scope.user = newCurrentUser,
    editData = $scope.editData = _.pick(user, ['bio', 'skills', 'organizations', 'avatar_url', 'banner_url']),
    edited = {};

  $scope.save = function() {
    if (!edited.skills) delete editData.skills;
    if (!edited.organizations) delete editData.organizations;

    user.update(editData, function() {
      _.extend(user, editData);
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

});

module.exports = function(angularModule) {
  angularModule.controller('ProfileEditCtrl', dependencies);
};
