var controller = function($scope, $modalInstance, Post, User) {

  var post = $scope.post,
    contributors = $scope.contributors = [];

  $scope.save = function () {
    Post.fulfill({id: post.id, contributors: _.pluck(contributors, 'id')}, function() {
      post.contributors = contributors;
      post.fulfilled_at = new Date();
    });
    $modalInstance.close();
  };

  $scope.findMembers = function(search) {
    return User.autocomplete({q: search}).$promise;
  };

};

module.exports = function(angularModule) {
  angularModule.controller('FulfillmentCtrl', controller);
};
