var dependencies = ['$scope', 'Post', 'growl', '$timeout', '$http', '$q', '$modal', '$analytics', '$state', 'community'];
dependencies.push(function($scope, Post, growl, $timeout, $http, $q, $modal, $analytics, $state, community) {

  $scope.community = community;

  $analytics.eventTrack('Community: Load Community', {
    community_id: community.id,
    community_name: community.name,
    community_slug: community.slug
  });

  var startOnboarding = function() {
    var modalInstance = $modal.open({
      templateUrl: '/ui/app/onboarding.tpl.html',
      controller: "OnboardingCtrl",
      keyboard: false,
      backdrop: 'static'
    });

    modalInstance.result.then(function() {
      $scope.currentUser.finishedOnboarding = true;
      $http.post('/endtour', {}, {params: {tour:'onboarding'}});

    }, function() {
      // dismissed modal... do nothing
    });
  };

  if (!$scope.currentUser.finishedOnboarding) {
    $timeout(startOnboarding, 100)
  }
});

module.exports = function(angularModule) {
  angularModule.controller('CommunityCtrl', dependencies);
};