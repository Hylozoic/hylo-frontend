angular.module("hyloControllers").controller('CommunityCtrl', ['$scope', '$rootScope', 'Post', 'growl', '$timeout', '$http', '$q', '$modal', '$analytics', '$state',
  function($scope, $rootScope, Post, growl, $timeout, $http, $q, $modal, $analytics, $state) {

    $scope.state = $state;

    $scope.$watch('community', function watchCommunity(communityPromise) {
      if (communityPromise) {
        communityPromise.$promise.then(function () {
          $analytics.eventTrack('Community: Load Community', {community_id: $scope.community.id, community_name: $scope.community.name, community_slug: $scope.community.slug});
        });
      }
    });

    var startOnboarding = function() {
      var modalInstance = $modal.open({
        templateUrl: '/ui/app/onboarding.tpl.html',
        controller: "OnboardingCtrl",
        keyboard: false,
        backdrop: 'static'
      });

      modalInstance.result.then(function () {
        $rootScope.currentUser.finishedOnboarding = true;
        $http.post('/endtour', {}, {params: {tour:'onboarding'}});

      }, function () {
        // Dismissed Modal...Do nothing
      });
    }

    $scope.currentUser.$promise.then(function(user) {
      // Start the community tour/onboarding if the user hasn't finished it.
      if (!user.finishedOnboarding) {
        $timeout(startOnboarding, 100)
      }
    });
  }]);
