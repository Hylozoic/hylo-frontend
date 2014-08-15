hyloControllers.controller('FulfillModalCtrl', ['$scope', '$rootScope', '$modalInstance', 'User', 'Post', '$log',
  function($scope, $rootScope, $modalInstance, User, Post, $log) {
    $scope.addContributors = function () {
      Post.markFulfilled({id: $scope.post.id, contributors: $scope.contributors}, function(res) {
        $scope.post.fulfilled = true;
        $scope.post.contributors = _.map($scope.contributors, function(contributor) {return {id: contributor.value, name: contributor.name, avatar: contributor.avatar} });
        $modalInstance.close();
      }, function(error) {
        $log.error("Error marking seed as fulfilled")
      });
    };

    $scope.typeaheadOpts = {
      minLength: 1,
      templateUrl: '/ui/app/typeahead-tag-user.tpl.html',
      waitMs: 100
    };

    $scope.contributors = [];
    $scope.potentialContributors = [];

    // Build list of potential contributors
    User.query({community: $rootScope.community.slug}, function(res) {

      // build the list of possible contributors as:
      // (All posts' community members).map(ngTag elements with a bit for topContributor) - curUser
      var allUsers = _.map(res, function(user) {
        return {value: user.id, // Map users to ngTag elements
          name: user.name,
          avatar: user.avatar,
          topContributor: _.contains($scope.topContributors, user.id) // Set topContributor to true if they are contained in topContributors list
        }
      });

      // remove currentUser from list of potentials
      $scope.potentialContributors = _.without(allUsers, _.findWhere(allUsers, {value: $rootScope.currentUser.id}));

    });

    $scope.selectTopContributor = function(tc) {
      tc.selected = !tc.selected;

      if (tc.selected) {
        $scope.contributors.push(tc);
      } else {
        $scope.contributors = _.without($scope.contributors, _.findWhere($scope.contributors, {value: tc.value}));
      }
    }

    $scope.$on("decipher.tags.added", function(event, args) {
      $scope.contributors.push(args.tag);
      args.tag.selected = true;
    });

    $scope.$on("decipher.tags.removed", function(event, args) {
      $scope.contributors = _.without($scope.contributors, _.findWhere($scope.contributors, {value: args.tag.value}));
      args.tag.selected = false;
    });
  }
]);
