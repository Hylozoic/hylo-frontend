var dependencies = ['$scope', '$analytics', 'User', 'user', 'editable', 'Post'];
dependencies.push(function($scope, $analytics, User, user, editable, Post) {
  $scope.user = user;
  $scope.editable = editable;

  if (!user.banner_url) {
    user.banner_url = require('../services/defaultUserBanner');
  }

  $scope.hasPosts = true;

  Post.forUser({userId: user.id}).$promise.then(function(posts) {
    $scope.posts = posts;
    $scope.hasPosts = posts.length > 0;
  });

  $scope.removePost = function(post) {
    growl.addSuccessMessage("Seed has been removed: " + post.name, {ttl: 5000});
    $scope.posts.splice($scope.posts.indexOf(post), 1);
  };

});

module.exports = function(angularModule) {
  angularModule.controller('ProfileCtrl', dependencies);
};
