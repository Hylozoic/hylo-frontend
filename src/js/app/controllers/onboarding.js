angular.module("hyloControllers").controller('OnboardingCtrl', ['$scope', '$rootScope', '$modalInstance', 'Post', '$log', '$analytics',
  function($scope, $rootScope, $modalInstance, Post, $log, $analytics) {

    $scope.wizard = {};
    $analytics.eventTrack("Onboarding: Started Wizard");

    $scope.wizard.offer = "I'd like to share ";
    $scope.wizard.request = "I'm looking for ";
    $scope.wizard.intention = "I'd like to create ";

    $scope.$watch('currentUser', function(user) {
      user.$promise.then(function(user) {
        $scope.wizard.skills = user.skills;
        $scope.wizard.organizations = user.organizations;
      });
    });

    $scope.saveSkills = function() {
      $rootScope.currentUser.$save(function(u, putRespHeaders) {
        $analytics.eventTrack("Onboarding: Saved User Skills");
      });
    }

    $scope.skip = function skip(seedType) {
      switch(seedType) {
        case 'offer':
          $scope.wizard.offer = "";
          break;
        case 'request':
          $scope.wizard.request = "";
          break;
        case 'intention':
          $scope.wizard.intention = "";
          break;
        default:
      }
    }

    $scope.saveOrgs = function() {
      $rootScope.currentUser.$save(function(u, putRespHeaders) {
        $analytics.eventTrack("Onboarding: Saved User Organizations");
      });
    }

    var createPost = function(name, type, callback) {
      if (name && name.trim().length > 0
          && name != "I'd like to create "
          && name != "I'd like to share "
          && name != "I'm looking for ") {
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

      $analytics.eventTrack("Onboarding: Finished Wizard");

      $modalInstance.close("success");
      //createPost($scope.wizard.offer, "offer");
      //createPost($scope.wizard.request, "request");
      //createPost($scope.wizard.intention, "intention", function() {
      //  $modalInstance.close("success");
      //});
    }

  }
]);
