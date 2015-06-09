var controller = function($scope, $modalInstance, Post, Community) {

  var post = $scope.post,
    contributors = $scope.contributors = [];

  $scope.save = function () {
    Post.fulfill({id: post.id, contributors: _.pluck(contributors, 'id')}, function() {
      post.contributors = contributors;
      post.fulfilled = true;
    });
    $modalInstance.close();
  };

  $scope.findMembers = function(search) {
    return Community.findMembers({id: post.community.id, autocomplete: search, limit: 5}).$promise;
  };

};

module.exports = function(angularModule) {
  angularModule.controller('FulfillmentCtrl', controller);
};
