module.exports = function($scope, Post, $analytics, CurrentUser) {
  'ngInject';

  var post = $scope.post;
  $scope.user = post.relatedUsers[0];
  $scope.isFollowing = () => _.any(post.followers, CurrentUser.is);

  $scope.unfollow = () => {
    Post.follow({id: post.id});
    post.followers = _.without(post.followers, _.find(post.followers, CurrentUser.is));
  };
};
