angular.module("hylo.createCommunity", [])
    .controller("CreateCommunityCtrl", [ "$scope", '$timeout', '$analytics', '$state', '$log', 'CreateCommunity',
      function ($scope, $timeout, $analytics, $state, $log, CreateCommunity) {

        $scope.createForm = {
          name: "",
          slug: "",
          coreIntention: "",
          category: "",
          banner: "https://d3ngex8q79bk55.cloudfront.net/communities/default/communitiesDefaultBanner.jpg",
          icon: "https://d3ngex8q79bk55.cloudfront.net/communities/default/communitiesDefaultIcon.png"
        };

        $scope.categoryListOptions = {
          'coworking': 'Co-working',
          'makerspace': 'Makerspace',
          'neighborhood': 'Neighborhood',
          'event': 'Special Event',
          'other': 'Other'
        };

        $scope.joiningOptions = {
          'private': 'Private - anyone may request to join',
          'public': 'Public - anyone can join'
        };

        $scope.joiningOptionsAdd = {
          private: {
            "moderatorOnly": "Only Moderators may add members",
            "anyone": "Any member may add members"
          },
          public: {
            "anyone": "Any"
          }
        };

        $scope.sharingOptions = {
          'yes': 'Yes, on Facebook, Twitter and LinkedIn',
          'no': 'No, I dont want seeds to be shared outside this community'
        };

        $scope.membershipOptions = {
          'yes': 'Yes',
          'no': 'No'
        };

        $scope.step = 1;

        $scope.cancelCreate = function cancelCreate() {
          if ($scope.navigated) { // If the rootscope 'navigated' boolean is true, then just go back TODO change to Service method
            history.back();
            $scope.apply();
          } else { // Otherwise, go home
            $state.go('home')
          }
        }

        $scope.next = function next(form) {
          // Trigger validation flag.
          console.log(form)
          form.submitted = true;

          // If form is invalid, return and let AngularJS show validation errors.
          if (form.$invalid) {
            console.log("invalid", form)
            return;
          }

          $scope.step++;
        }

        $scope.setBannerPos = function setBannerPos(position) {
          $scope.createForm.bannerPos = position;
        }

        $scope.setIconPos = function setIconPos(position) {
          $scope.createForm.iconPos = position;
        }

        $scope.previous = function previous() {
          $scope.step--;
        }

        $scope.pickBanner = function(imageModel, width, height) {
          // This will pick a file and store the original file in the 'orig/' subfolder, then convert it to a 200x200 image and store
          // that into the 'thumb/' folder with the same key.
          $scope.loadingBanner = true;

          var convertSettings = {
            width: 1600,
            format: 'jpg',
            fit: 'max',
            rotate: "exif"
          };

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
              filepicker.convert(inkBlob, convertSettings, {
                    location: 'S3',
                    path: 'communityBanner/' + inkBlob.key.substring(5), // Store the converted image into the 'thumb/' subfolder with the same key as the orig file (by substringing off the 'orig/')
                    access: 'public'
                  },
                  function (new_InkBlob) { // Success Handler
                    // set the user avatar image by replacing the url with the cloudfront hosted image.
                    $timeout(function() {
                      $scope.loadingBanner = false;
                      $scope.$digest();
                    }, 1000);
                    console.log(new_InkBlob);

                    var cloudFrontURL = new_InkBlob.url.replace('www.filepicker.io', 'd2kdz49m4u0buf.cloudfront.net');

                    $analytics.eventTrack("Uploaded image", {url: cloudFrontURL});

                    $scope.createForm.banner = cloudFrontURL;
                    $scope.bannerChosen = true;

                  }, function(FPERROR) { // Error Handler
                    growl.addErrorMessage('Error uploading image.  Please try again.');
                    $scope.loadingBanner = false;
                  }, function(percent) { // On Progress Handler
                    $scope.loadingBanner = true;
                  }
              );
            });
          }, function (FPError) {
            $scope.loadingBanner = false;
            $scope.$digest();
            $log.error(FPError);
            if (FPError.code != 101) {
              growl.addErrorMessage('Error uploading image.  Please try again.');
            }
          });
        };

        $scope.pickIcon = function() {
          // This will pick a file and store the original file in the 'orig/' subfolder, then convert it to a 200x200 image and store
          // that into the 'thumb/' folder with the same key.
          $scope.loadingIcon = true;

          var convertSettings = {
            width: 160,
            fit: 'clip',
            rotate: "exif"
          };

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
              filepicker.convert(inkBlob, convertSettings, {
                    location: 'S3',
                    path: 'communityIcon/' + inkBlob.key.substring(5), // Store the converted image into the 'thumb/' subfolder with the same key as the orig file (by substringing off the 'orig/')
                    access: 'public'
                  },
                  function (new_InkBlob) { // Success Handler
                    // set the user avatar image by replacing the url with the cloudfront hosted image.
                    $timeout(function() {
                      $scope.loadingIcon = false;
                      $scope.$digest();
                    }, 1000);

                    var cloudFrontURL = new_InkBlob.url.replace('www.filepicker.io', 'd2kdz49m4u0buf.cloudfront.net');

                    $analytics.eventTrack("Uploaded image", {url: cloudFrontURL});

                    $scope.createForm.icon = cloudFrontURL;
                    $scope.iconChosen = true;

                  }, function(FPERROR) { // Error Handler
                    growl.addErrorMessage('Error uploading image.  Please try again.');
                    $scope.loadingIcon = false;
                  }, function(percent) { // On Progress Handler
                    $scope.loadingIcon = true;
                  }
              );
            });
          }, function (FPError) {
            $scope.loadingIcon = false;
            $scope.$digest();
            $log.error(FPError);
            if (FPError.code != 101) {
              growl.addErrorMessage('Error uploading image.  Please try again.');
            }
          });
        };

        $scope.submit = function(form) {

          console.log("creating community")

          var newCommunity = new CreateCommunity($scope.createForm);

          newCommunity.$save(function (value, respHeaders) {
            console.log("community creation finished")
            $analytics.eventTrack('Created new community');
            // Invoke scope function

            $state.go("community", {community: value.slug});
          }, function (responseValue) {
            $log.error("error", responseValue);
          });

        }

      }
    ])

.factory("CreateCommunity", ["$resource",
  function($resource) {
    return $resource("/create/community")
  }]);
