angular.module("hyloControllers").controller('OnboardingCtrl', ['$scope', '$rootScope', '$modalInstance', 'User', 'Post', '$log', '$analytics',
  function($scope, $rootScope, $modalInstance, User, Post, $log, $analytics) {

    $scope.wizard = {};

    $scope.$watch('currentUser', function(user) {
      user.$promise.then(function(user) {
        $scope.wizard.skills = user.skills;
        $scope.wizard.organizations = user.organizations;
      });
    });

    $scope.saveSkills = function() {
      $rootScope.currentUser.$save(function(u, putRespHeaders) {
        $analytics.eventTrack("Saved User Skills Onboarding");
      });
    }

    $scope.saveOrgs = function() {
      $rootScope.currentUser.$save(function(u, putRespHeaders) {
        $analytics.eventTrack("Saved User Organizations Onboarding");
      });
    }

    var createPost = function(name, type, callback) {
      if (name && name.trim().length > 0) {
        var newPost = new Post();
        newPost.name = name;
        newPost.description = "";
        newPost.postType = type;
        newPost.communityId = $rootScope.community.id;

        newPost.$save(callback);
      } else {
        if (_.isFunction(callback)) {
          callback();
        }
      }
    }

    $scope.finishedWizard = function() {

      $analytics.eventTrack("Finished Wizard");

      createPost($scope.wizard.offer, "offer");
      createPost($scope.wizard.request, "request");
      createPost($scope.wizard.intention, "intention", function() {
        $modalInstance.close("success");
      });
    }

  }
]);
