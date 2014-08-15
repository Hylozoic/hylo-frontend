hyloControllers.controller('UserCtrl', ['$scope', '$stateParams', '$state', '$log', 'Post', 'growl', 'User', '$timeout', '$http', '$rootScope', '$analytics',
  function($scope, $stateParams, $state, $log, Post, growl, User, $timeout, $http, $rootScope, $analytics) {
    var previous = {};

    $scope.editing = false;

    $scope.loading = false;

    var startTour = function() {
      guiders.createGuider({
        attachTo: ".organizations",
        buttons: [{name: "Next"}],
        description: "To get started, enter a couple of the communities or organizations you're a part of",
        id: "userFirst",
        next: 'userSecond',
        position: 3,
        title: "Hi, welcome to your profile on Hylo!",
        onShow: $scope.edit
      }).show();

      guiders.createGuider({
        attachTo: ".skills",
        buttons: [{name: "Next"}],
        description: "Great! now enter a couple of the things you enjoy, things you're good at",
        id: "userSecond",
        next: 'userThird',
        position: 3,
        title: "Enter some skills",
        onShow: $scope.edit,
        onHide: $scope.save
      })

      guiders.createGuider({
        attachTo: "#menu-community",
        buttons: [{name: "Finish",
          onclick: function() {
            guiders.hideAll();
          }}],
        description: "To view your communities seeds click here",
        id: "userThird",
        position: 3,
        onHide: function() {
          $http.post('/endtour', {}, {params: {tour:'profileTour'}});
          $rootScope.currentUser.profileTour = false;
        },
        title: "Community Seeds"
      });
    }

    $rootScope.$watch('currentUser', function(user) {
      user.$promise.then(function(user) {
        if (user.id == $stateParams.id) {
          $scope.user = user;
          $scope.editable = true;

          // TODO Disable the profile tour since we need to update it after the onboarding is in place.
//          if (user.profileTour) {
//            $timeout(startTour, 900);
//          }
        } else {
          $scope.user = User.get({id: $stateParams.id});
          $scope.editable = false;
        }
      });
    });
    $scope.hasPosts = true;

    Post.forUser({userId: $stateParams.id}).$promise.then(function(posts) {
      $scope.posts = posts;
      $scope.hasPosts = posts.length > 0;
    });

    $scope.removePost = function(postToRemove) {
      growl.addSuccessMessage("Seed has been removed: " + postToRemove.name, {ttl: 5000});
      $scope.posts.splice($scope.posts.indexOf(postToRemove), 1);
    }

    $scope.reputationExpanded = false;
    $scope.reputations = [];

    $scope.startTY = 0;
    $scope.startC = 0;
    $scope.noRepResults = false;
    $scope.noMoreResults = false;

    $scope.expandReputation = function() {
      $scope.reputationExpanded = !$scope.reputationExpanded;

      if (!$scope.noMoreResults) {
        $scope.loadReps();
      }
    }

    $scope.loadReps = function() {
      $http.get('/user/recent-reputation', {
        params: {
          userId: $stateParams.id,
          startTY: $scope.startTY,
          startC: $scope.startC
        },
        responseType: 'json'
      }).success(function(reputations) {
          angular.forEach(reputations, function(rep, key) {
            $scope.reputations.push(rep);
            if (rep.repType == "TY") {
              $scope.startTY++;
            } else {
              $scope.startC++;
            }
          });

          $scope.noMoreResults = reputations.length == 0;
          $scope.noRepResults = $scope.reputations.length == 0;

        });
    }

    $scope.pickFile = function() {
      // This will pick a file and store the original file in the 'orig/' subfolder, then convert it to a 200x200 image and store
      // that into the 'thumb/' folder with the same key.
      $scope.loading = true;
      filepicker.pickAndStore({
        mimetype: "image/*",
        multiple: false,
        services: ['COMPUTER', 'FACEBOOK', 'WEBCAM', 'GOOGLE_DRIVE', 'DROPBOX', 'INSTAGRAM', 'FLICKR', 'URL'],
        folders: false
      }, {
        location: "S3",
        path: 'orig/',
        access: 'public'
      }, function (InkBlobs) {
        $.each(InkBlobs, function(index, inkBlob) { // Convert the newly uploaded image to a thumbnail
          filepicker.convert(inkBlob, {
              width: 200,
              height: 200,
              fit: 'clip'
            }, {
              location: 'S3',
              path: 'thumb/' + inkBlob.key.substring(5), // Store the converted image into the 'thumb/' subfolder with the same key as the orig file (by substringing off the 'orig/')
              access: 'public'
            },
            function (new_InkBlob) { // Success Handler
              // set the user avatar image by replacing the url with the cloudfront hosted image.
              $timeout(function() {
                $scope.loading = false;
                $scope.$digest();
              }, 1000);

              var cloudFrontURL = new_InkBlob.url.replace('www.filepicker.io', 'd2kdz49m4u0buf.cloudfront.net');

              $analytics.eventTrack("Uploaded Profile Image", {url: cloudFrontURL});

              $scope.user.avatar = cloudFrontURL;

            }, function(FPERROR) { // Error Handler
              growl.addErrorMessage('Error saving new profile image.  Please try again.');
              $scope.loading = false;
            }, function(percent) { // On Progress Handler
              $scope.loading = true;
            }
          );
        });
      }, function (FPError) {
        $scope.loading = false;
        $scope.$digest();
        $log.error(FPError);
        if (FPError.code != 101) {
          growl.addErrorMessage('Error saving new profile image.  Please try again.');
        }
      });
    };

    $scope.edit = function() {
      if (!$scope.editing) {
        $scope.editing = true;
        previous.name = $scope.user.name;
        previous.skills = $scope.user.skills.slice();
        previous.organizations = $scope.user.organizations.slice();
        previous.avatar = $scope.user.avatar;
      }
    }

    $scope.cancel = function() {
      $scope.editing = false;
      $scope.user.name = previous.name;
      $scope.user.skills = previous.skills.slice();
      $scope.user.organizations = previous.organizations.slice();
      $scope.user.avatar = previous.avatar;
    }

    $scope.save = function() {
      if ($scope.editing) {
        $scope.editing = false;
        $scope.user.$save(function(u, putRespHeaders) {
          $analytics.eventTrack("Updated Profile Info");
          growl.addSuccessMessage('Saved!');
          // TODO for now we just re-retrieve the users posts to get their new thumbnails...maybe there is a better solution?
          Post.forUser({userId: $stateParams.id}).$promise.then(function(posts) {
            $scope.posts = posts;
            $scope.hasPosts = posts.length > 0;
          });
        });
      }
    }

    $scope.addPostFn = function(newPost) {
      growl.addSuccessMessage("Successfully created new seed: " + newPost.name, {ttl: 5000});
      $scope.posts.unshift(newPost);
    }
  }]);
