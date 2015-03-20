var controller = function($scope, $analytics, user, isSelf, growl, onboarding) {
  $scope.user = user;
  $scope.isSelf = isSelf;

  $analytics.eventTrack('Member Profiles: Loaded a profile', {user_id: $scope.user.id});
  if (isSelf) $analytics.eventTrack('Member Profiles: Loaded Own Profile');

  if (!user.banner_url) {
    user.banner_url = require('../services/defaultUserBanner');
  }

  if (isSelf && onboarding) {
    var step = onboarding.currentStep();
    if (_.include(['profile'], step)) {
      onboarding.showOverlay(step);
    }
  }

  $scope.normalizeUrl = function(url) {
    if (url.substring(0, 4) === 'http')
      return url;

    return 'http://' + url;
  };

};

module.exports = function(angularModule) {
  angularModule.controller('ProfileCtrl', controller);
};
