var dependencies = ['$scope', '$analytics', 'User', 'user', 'editable', 'posts'];
dependencies.push(function($scope, $analytics, User, user, editable, posts) {
  $scope.user = user;
  $scope.editable = editable;
  $scope.posts = posts;
  $scope.hasPosts = posts.length > 0;

  $analytics.eventTrack('User: Load a Member Profile', {user_id: $scope.user.id});
  if ($scope.editable) $analytics.eventTrack('User: Load Own Profile');

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

});

module.exports = function(angularModule) {
  angularModule.controller('ProfileCtrl', dependencies);
};
