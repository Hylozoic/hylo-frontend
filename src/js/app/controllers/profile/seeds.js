var dependencies = ['$scope', '$analytics', 'posts',];
dependencies.push(function($scope, $analytics, posts ) {
	$scope.posts = posts;
	$scope.hasPosts = posts.length > 0;

	$scope.removePost = function(post) {
	    growl.addSuccessMessage("Seed has been removed: " + post.name, {ttl: 5000});
	    $analytics.eventTrack('Post: Remove a Seed', {post_name: post.name, post_id: post.id});
	    $scope.posts.splice($scope.posts.indexOf(post), 1);
	  };

});

module.exports = function(angularModule) {
  angularModule.controller('ProfileSeedsCtrl', dependencies);
};
