angular.module("hylo.seeds", [])
  .directive('hyloSeedForm', [
    "Post", '$rootScope', '$log', '$analytics',
    function (Post, $rootScope, $log, $analytics) {
      return {
        restrict: 'E',
        templateUrl: "/ui/features/seeds/seed_form.tpl.html",
        replace: true,
        scope: {
          onCancel: "&",
          onSuccess: "&"
        }, // Function to invoke in the parent after adding a new post.
        controller: function ($scope, $element) {
          $scope.postType = "intention";

          var limit = 120;

          // Initially focus input onto the seed title
          $scope.focusInput = true;

          $scope.typeChanged = function typeChanged(newType) {
            $scope.postType = newType;
            $scope.onTitleChange();
          }

          $scope.onTitleChange = function (event) {
            var titleLength = 0;
            if ($scope.title[$scope.postType]) { // test if property is undefined, then length is 0
              titleLength = $scope.title[$scope.postType].length;
            }

            var charsLeft = limit - titleLength;
            var hasWarning = charsLeft <= 10;
            var hasError = titleLength > limit;

            $scope.charsLeft = charsLeft;
            $scope.charLimitWarning = (hasWarning && !hasError);
            $scope.charLimitError = hasError;

          };

          $scope.reset = function () {
            $scope.title = {};
            $scope.title["intention"] = "I'd like to create ";
            $scope.title["offer"] = "I'd like to share ";
            $scope.title["request"] = "I'm looking for ";

            $scope.description = "";
            $scope.editing = false;
            $scope.saving = false;
          };

          var communityWatch = $rootScope.$watch('community', function (community) {
            $scope.community = community;
          });

          $scope.$on("destroy", function(){
            communityWatch();
          });

          $scope.reset();

          $scope.cancel = function() {
            $scope.onCancel();
          };

          $scope.save = function () {
            if ($scope.saving) return false;
            $scope.saving = true;

            var newPost = new Post();
            newPost.name = $scope.title[$scope.postType];
            newPost.description = $scope.description;
            newPost.postType = $scope.postType;
            newPost.communityId = $scope.community.id;

            newPost.$save(function (value, respHeaders) {
              $scope.reset();
              $analytics.eventTrack('Add Post');
              // Invoke scope function
              $scope.onSuccess({seed: value});

            }, function (responseValue) {
              $log.error("error", responseValue);
            });
          }
        }
      };
    }]);
