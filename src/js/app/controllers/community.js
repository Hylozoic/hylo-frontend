angular.module("hyloControllers").controller('CommunityCtrl', ['$scope', '$rootScope', 'Post', 'growl', '$timeout', '$http', '$q', '$modal', '$analytics', '$state',
  function($scope, $rootScope, Post, growl, $timeout, $http, $q, $modal, $analytics, $state) {

    $scope.state = $state;

    $scope.community.$promise.then(function () {
      $analytics.eventTrack('Community: Load Community', {community_id: $scope.community.id, community_name: $scope.community.name, community_slug: $scope.community.slug});
    });

    var startTour = function() {
      guiders.createGuider({
        buttons: [{name: "Next"}],
        description: "Hylo is a resource sharing network for your community.",
        id: "first",
        next: "second",
        overlay: true,
        title: "Let's Get Started!"
      }).show();

      guiders.createGuider({
        attachTo: document.querySelectorAll(".post-header")[0],
        buttons: [{name: "Next"}],
        description: "Here are the seeds from your community.  You can heart a seed by clicking the <i class='icon-heart-new'></i>, or comment on it by clicking the <i class='icon-comment'></i>",
        id: "second",
        next: 'third',
        position: 7,
        title: "Let’s create together!"
      });

      guiders.createGuider({
        attachTo: document.querySelectorAll(".filter-buttons")[0],
        buttons: [{name: "Next"}],
        description: "Filter the seeds by intention, request, offer or all.",
        id: "third",
        next: "fourth",
        position: 5,
        title: "Filter seeds by type"
      });

      guiders.createGuider({
        attachTo: "#community-addSeedButton",
        buttons: [{name: "Done", onclick: function() {
          guiders.hideAll();
        }}],
        description: "Click here to add a seed of your own.",
        id: "fourth",
        //next: "fifth",
        position: 7,
        title: "Plant a New Seed",
        onHide: function() {
          $http.post('/endtour', {}, {params: {tour:'communityTour'}});
          $rootScope.currentUser.communityTour = false;
        }
      });

      //guiders.createGuider({
      //  attachTo: "#menu-user",
      //  buttons: [{name: "Done", onclick: function() {
      //    guiders.hideAll();
      //  }}],
      //  description: "Click here to access your profile.",
      //  id: "fifth",
      //  position: 3,
      //  title: "Your Profile",
      //  onHide: function() {
      //    $http.post('/endtour', {}, {params: {tour:'communityTour'}});
      //    $rootScope.currentUser.communityTour = false;
      //  }
      //});
    }

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

        // Start the community tour if the user hasn't started yet
        if ($rootScope.currentUser.communityTour) {
          $timeout(startTour, 500);
        }

      }, function () {
        // Dismissed Modal...Do nothing
      });
    }

    $scope.currentUser.$promise.then(function(user) {
      // Start the community tour/onboarding if the user hasn't finished it.
      if (!user.finishedOnboarding) {
        $timeout(startOnboarding, 100)
      } else if (user.communityTour) {
        $timeout(startTour, 500);
      }
    });
  }]);
