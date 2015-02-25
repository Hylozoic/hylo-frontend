var controller = function($scope, $analytics, User, user, isSelf, posts, growl, onboarding) {
  $scope.user = user;
  $scope.isSelf = isSelf;
  $scope.posts = posts;
  $scope.hasPosts = posts.length > 0;

  $analytics.eventTrack('Member Profiles: Loaded a profile', {user_id: $scope.user.id});
  if (isSelf) $analytics.eventTrack('Member Profiles: Loaded Own Profile');

  if (!user.banner_url) {
    user.banner_url = require('../services/defaultUserBanner');
  }

  $scope.removePost = function(post) {
    growl.addSuccessMessage("Seed has been removed: " + post.name, {ttl: 5000});
    $analytics.eventTrack('Post: Remove a Seed', {post_name: post.name, post_id: post.id});
    $scope.posts.splice($scope.posts.indexOf(post), 1);
  };

  $scope.twitterUrl = function() {
    return 'https://twitter.com/' + user.twitter_name;
  };

  $scope.clickedSocialLink = function(network, url) {
    $analytics.eventTrack('Member Profiles: Clicked a Social Media link', {'network': network, 'url': url});
  };

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
