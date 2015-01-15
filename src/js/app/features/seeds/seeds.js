angular.module("hylo.seeds", [])
  .directive('hyloSeedForm', [
    "Post", '$rootScope', '$log', '$analytics', 'UserMentions', 'Seed',
    function (Post, $rootScope, $log, $analytics, UserMentions, Seed) {
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
          };

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

          $scope.people = [];

          $scope.searchPeople = function(query) {
            var peopleList = [];
            return $rootScope.community.members({search: query}).$promise.then(function (items) {
              angular.forEach(items, function(item) {
                if (item.name.toUpperCase().indexOf(query.toUpperCase()) >= 0) {
                  peopleList.push(item);
                }
              });
              $scope.people = peopleList;
              return $q.when(peopleList);
            });
          };

          $scope.getPeopleTextRaw = function(person) {
            return '<a contenteditable="false" tabindex="-1" target="_blank" href="/u/' + person.id + '" data-user-id="' + person.id + '">@' + person.name + '</a>'
          };

          $scope.reset();

          $scope.cancel = function() {
            $scope.onCancel();
          };

          $scope.people = [];

          $scope.searchPeople = function(query) {
            var peopleList = [];
            $rootScope.community.members({search: query}).$promise.then(function (items) {
              angular.forEach(items, function(item) {
                if (item.name.toUpperCase().indexOf(query.toUpperCase()) >= 0) {
                  peopleList.push(item);
                }
              });
              $scope.people = peopleList;
            });
          };

          $scope.getPeopleTextRaw = UserMentions.userTextRaw;


          $scope.save = function () {
            if ($scope.saving) return false;
            $scope.saving = true;

            var newSeed = new Seed();
            newSeed.name = $scope.title[$scope.postType];
            newSeed.description = $scope.description;
            newSeed.postType = $scope.postType;
            newSeed.communityId = $scope.community.id;

            newSeed.$save(function (value, respHeaders) {
              $scope.reset();
              $analytics.eventTrack('Add Post');
              // Invoke scope function
              $scope.onSuccess({seed: value});

            }, function (responseValue) {
              $scope.saving = false,
              $log.error("error", responseValue);
            });
          }
        }
      };
    }]);
