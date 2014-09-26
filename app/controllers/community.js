angular.module("hyloControllers").controller('CommunityCtrl', ['$scope', '$rootScope', 'Post', 'growl', '$timeout', '$http', '$q', '$modal', '$analytics',
  function($scope, $rootScope, Post, growl, $timeout, $http, $q, $modal, $analytics) {

    $scope.seedFilter = "all";
    $scope.seedSort = "recent";

    $scope.start = 0;
    $scope.limit = 12;

    $rootScope.$watch('community', function watchCommunity(communityPromise) {
      communityPromise.$promise.then(function() {
        $scope.query();
      });
    });

    $scope.posts = [];
    $scope.searchQuery = "";

    // Initially Disabled Infinite Scroll
    $scope.disableInifiniteScroll = true;

    var cancelerStack = [];

    $scope.resetQuery = function () {
      $scope.start = 0;
      $scope.posts = [];
      $scope.query();
    }

    $scope.queryTimeout = _.throttle(function() {
      $scope.resetQuery();
    }, 750, {leading: false});


    $scope.$watch("seedFilter", $scope.resetQuery);
    $scope.$watch("seedSort", $scope.resetQuery);

    $scope.query = function() {
      // Cancel any outstanding queries
      _.each(cancelerStack, function(canceler) { canceler.resolve() });
      cancelerStack = [];

      var newCanceler = $q.defer();
      cancelerStack.push(newCanceler);

      $scope.disableInifiniteScroll = true;
      $scope.searching = true;

      $http.get('/posts', {
        params: {
          q: $scope.searchQuery,
          community: $rootScope.community.slug,
          postType: $scope.seedFilter,
          sort: $scope.seedSort,
          start: $scope.start,
          limit: $scope.limit
        },
        timeout: newCanceler.promise,
        responseType: 'json'
      }).success(function(posts) {
        angular.forEach(posts, function(post, key) {
          if (!_.findWhere($scope.posts, {id: post.id})) {
            $scope.posts.push(post);
            $scope.start++;
          }
        });

        $scope.searching = false;
        $scope.noResults = $scope.posts.length == 0;

        if (posts.length == 0) { // There were no more posts... disable infinite scroll now
          $scope.disableInifiniteScroll = true;
        } else {
          $scope.disableInifiniteScroll = false;
        }
      });
    };

    $scope.addSeedSuccess = function(newSeed) {
      growl.addSuccessMessage("Successfully created new seed: " + newSeed.name, {ttl: 5000});
      $scope.posts.unshift(newSeed);
      $scope.showSeedForm = false;
    }

    $scope.addSeedCancel = function(){
      $scope.showSeedForm = false;
    }
    $scope.addSeed = function(){
      $scope.showSeedForm = true;
      $analytics.eventTrack('Open Add Seed Form');
    }

    $scope.remove = function(postToRemove) {
      growl.addSuccessMessage("Seed has been removed: " + postToRemove.name, {ttl: 5000});
      $scope.posts.splice($scope.posts.indexOf(postToRemove), 1);
    }

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
        attachTo: document.querySelectorAll(".post")[0],
        buttons: [{name: "Next"}],
        description: "Here are the seeds from your community.  You can heart a seed by clicking the <i class='icon-following'></i>, or comment on it by clicking the <i class='icon-comment'></i>",
        id: "second",
        next: 'third',
        position: 6,
        title: "Let’s create together!"
      });

      guiders.createGuider({
        attachTo: "#community-filter-buttons",
        buttons: [{name: "Next"}],
        description: "Filter the seeds by intention, request, offer or all.",
        id: "third",
        next: "fourth",
        position: 6,
        title: "Filter seeds by type"
      });

      guiders.createGuider({
        attachTo: "#community-addSeedButton",
        buttons: [{name: "Next"}],
        description: "Click here to add a seed of your own.",
        id: "fourth",
        next: "fifth",
        position: 7,
        title: "Add a New Seed"
      });

      guiders.createGuider({
        attachTo: "#menu-user",
        buttons: [{name: "Done", onclick: function() {
          guiders.hideAll();
        }}],
        description: "Click here to access your profile.",
        id: "fifth",
        position: 3,
        title: "Your Profile",
        onHide: function() {
          $http.post('/endtour', {}, {params: {tour:'communityTour'}});
          $rootScope.currentUser.communityTour = false;
        }
      });
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

        $scope.resetQuery();

        // Start the community tour if the user hasn't started yet
        if ($rootScope.currentUser.communityTour) {
          $timeout(startTour, 500);
        }

      }, function () {
        // Dismissed Modal...Do nothing
      });
    }

    $scope.$watch('currentUser', function(user) {
      user.$promise.then(function(user) {
        // Start the community tour/onboarding if the user hasn't finished it.
        if (!user.finishedOnboarding) {
          $timeout(startOnboarding, 100)
        } else if (user.communityTour) {
          $timeout(startTour, 500);
        }
      });
    });
  }]);
