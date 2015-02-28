var controller = function($scope, $analytics, user, isSelf, growl, onboarding) {
  $scope.user = user;
  $scope.isSelf = isSelf;

  $analytics.eventTrack('Member Profiles: Loaded a profile', {user_id: $scope.user.id});
  if (isSelf) $analytics.eventTrack('Member Profiles: Loaded Own Profile');

  if (!user.banner_url) {
    user.banner_url = require('../services/defaultUserBanner');
  }


  $scope.trackEmail = function() {
    $analytics.eventTrack('Member Profiles: Clicked Email Button', {user_id: $scope.user.id});
  };

  if (isSelf && onboarding) {
    var step = onboarding.currentStep();
    if (_.include(['profile', 'profileSaved'], step)) {
      onboarding.showOverlay(step);
    }
  }

};

module.exports = function(angularModule) {
  angularModule.controller('ProfileCtrl', controller);
};
