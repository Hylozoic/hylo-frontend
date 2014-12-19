angular.module("hyloControllers").controller('UserCtrl', [
  '$scope', '$stateParams', '$state', '$log', 'Post', 'growl', 'OldUser', '$timeout', '$http', '$analytics', '$window',
  function($scope, $stateParams, $state, $log, Post, growl, OldUser, $timeout, $http, $analytics, $window) {
    var previous = {};

    $scope.editing = false;
    $scope.loading = false;

    $scope.currentUser.$promise.then(function(user) {
      var isOwnProfile = (user.id == $stateParams.id);
      $analytics.eventTrack('User: Load a Member Profile', {user_id: user.id, is_own_profile: isOwnProfile});
      if (isOwnProfile) {
        $scope.user = user;
        $scope.editable = true;

      } else {
        $scope.user = OldUser.get({id: $stateParams.id});
        $scope.editable = false;
      }
    });

    $scope.openMailTo = function openMailTo(event) {
      event.preventDefault();
      event.stopPropagation();

      try {
        var isMobile = $window.matchMedia("only screen and (max-width: 760px)");

        if (isMobile.matches) {
          $window.location.href="mailto:" + $scope.user.email;
        } else {
          $window.open("mailto:" + $scope.user.email, "_blank");
        }
      } catch(err) {
        Rollbar.warn("Error trying to openMailTo link.  Defaulting to window.location.href", err);
        $window.location.href="mailto:" + $scope.user.email;
      }

      return false;
    };

    $scope.hasPosts = true;
    Post.forUser({userId: $stateParams.id}).$promise.then(function(posts) {
      $scope.posts = posts;
      $scope.hasPosts = posts.length > 0;
    });

    $scope.removePost = function(postToRemove) {
      growl.addSuccessMessage("Seed has been removed: " + postToRemove.name, {ttl: 5000});
      $scope.posts.splice($scope.posts.indexOf(postToRemove), 1);
    };

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
    };

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
    };

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

              $analytics.eventTrack("Uploaded Image: User Profile Image", {url: cloudFrontURL});

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
        $analytics.eventTrack("Profile: Open Edit Info", {user_id: $scope.user.id, user_name: $scope.user.name, user_email: $scope.user.email});
        $scope.editing = true;
        previous.name = $scope.user.name;
        previous.skills = $scope.user.skills.slice();
        previous.organizations = $scope.user.organizations.slice();
        previous.avatar = $scope.user.avatar;
      }
    };

    $scope.cancel = function() {
      $scope.editing = false;
      $scope.user.name = previous.name;
      $scope.user.skills = previous.skills.slice();
      $scope.user.organizations = previous.organizations.slice();
      $scope.user.avatar = previous.avatar;
    };

    $scope.save = function() {
      if ($scope.editing) {
        $scope.editing = false;
        $scope.user.$save(function(u, putRespHeaders) {
          $analytics.eventTrack("Profile: Updated User Info", {user_id: $scope.user.id, user_name: $scope.user.name, user_email: $scope.user.email});
          growl.addSuccessMessage('Saved!');
          // TODO for now we just re-retrieve the users posts to get their new thumbnails...maybe there is a better solution?
          Post.forUser({userId: $stateParams.id}).$promise.then(function(posts) {
            $scope.posts = posts;
            $scope.hasPosts = posts.length > 0;
          });
        });
      }
    }

  }]);
