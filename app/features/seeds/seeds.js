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

          var limit = 100;

          // Initially focus input onto the seed title
          $scope.focusInput = true;

          $scope.onTitleChange = function (event) {
            var titleLength = 0;
            if ($scope.title) { // test if property is undefined, then length is 0
              titleLength = $scope.title.length;
            }

            var charsLeft = limit - titleLength;
            var hasWarning = charsLeft <= 10;
            var hasError = titleLength > limit;

            $scope.charsLeft = charsLeft;
            $scope.charLimitWarning = (hasWarning && !hasError);
            $scope.charLimitError = hasError;

          };

          $scope.reset = function () {
            $scope.title = "";
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
            newPost.name = $scope.title;
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
