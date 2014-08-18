angular.module("hyloDirectives").directive('hyloPost', ["Post", '$filter', '$state', '$rootScope', '$log', '$modal', 'User', '$http', '$timeout', 'CommentingService', '$window', '$analytics',
  function(Post, $filter, $state, $rootScope, $log, $modal, User, $http, $timeout, CommentingService, $window, $analytics) {
  return {
    restrict: 'E',
    scope: {
      post: '=', // the post to generate markup for as a bi-directional model.  See http://docs.angularjs.org/api/ng.$compile
      'short': '@',
      'removeFn': '&'
    },
    controller: function($scope, $element) {
      $scope.isCommentsCollapsed = ($state.current.data && $state.current.data.singlePost) ? false : true;
      $scope.voteTooltipText = "";

      $scope.gotoPost = function($event) {
        if ($event.target) {
            // Check to see if we are clicking an embedded link...if so, then open the link instead of opening the post.
          if (!$($event.target).hasClass("post-header") && $($event.target).is("a")) {
            // If a hashtag link, then just return
            if ($($event.target).hasClass("hashtag")) {
              return true;
            }
            var href = $event.target.href;
            if (href) {
              $window.open(href, '_blank');
              $event.stopPropagation();
              $event.preventDefault();
              return false;
            }
          }
          if ($($event.target).hasClass("delete")) {
            $event.stopPropagation();
            $event.preventDefault();
            return false;
          }
        }
        $scope.isCommentsCollapsed = false;

        $event.stopPropagation();
        $event.preventDefault();
        return false;
      }

      $scope.followHash = function(value) {
        console.log("inside hylo post controller");
      }

      $scope.gotoSinglePost = function() {
        $state.go('post.comments', {community: $scope.post.communitySlug, postId: $scope.post.id})
      }

      var voteText = "click to <i class='icon-following'></i> me.";
      var unvoteText = "click to un-<i class='icon-following'></i> me.";

      $scope.vote = function() {
        var thisPost = $scope.post;
        var newVoteState = true; // TODO allow de-voting: !thisPost.myVote;

        thisPost.myVote = !thisPost.myVote;
        $scope.voteTooltipText = thisPost.myVote ? unvoteText : voteText;

        Post.vote({id: thisPost.id}, function(value, responseHeaders) {
          thisPost.votes = value.numVotes;
          thisPost.myVote = value.myVote;
          $analytics.eventTrack('Vote', {state: (thisPost.myVote ? 'on' : 'off')})
        });
      };

      $scope.onCommentIconClick = function() {
        if ($scope.isCommentsCollapsed)
          $analytics.eventTrack('Show Comments');

        $scope.isCommentsCollapsed = false;
        $timeout(function() {
          CommentingService.setFocus($scope.post.id);
        });
      }

      $scope.onFollowerIconClick = function() {
        $scope.isCommentsCollapsed = false;
      }

      $scope.followers = []; // list of current followers

      $scope.potentialFollowers = []; // List of all members that can potentially follow a post
      $scope.followersToAdd = []; // builds an array of followers to add after hitting the "complete" button

      $scope.$on("decipher.tags.added", function(event, args) {
        $scope.followersToAdd.push(args.tag);
      });

      $scope.$on("decipher.tags.removed", function(event, args) {
        $scope.followersToAdd.splice($scope.followersToAdd.indexOf(args.tag), 1);
      });

//      $scope.$on("decipher.tags.keyup", function(event, args) {
//        $http.get('/users/typeahead', {
//          params: {postId: $scope.post.id, q: args.value}
//        }).then(function(res) {
//          $scope.potentialFollowers = res.data;
//        });
//
//      });


//      $scope.typeaheadUsers = [];

//      $scope.typeahead = function(viewValue) {
//        if (!viewValue || viewValue.trim().length == 0) {
//          return [];
//        }
//        return $http.get('/users/typeahead', {
//          params: {postId: $scope.post.id, q: viewValue}
//        }).then(function(res){
//          var users = [];
//          angular.forEach(res.data, function(item){
//            users.push(item);
//          });
//          return users;
//        });
//      };

      $scope.editingFollowers = false;

      $scope.isFollowing = false;

      $scope.joinPostText = function() {
        if ($scope.isFollowing) {
          return "Leave";
        } else {
          return "Join";
        }
      }

      $scope.followPost = function() {
        Post.follow({id: $scope.post.id}, function(res) {
          $scope.followers.push(res);
        });
      }

      $scope.toggleJoinPost = function() {
        if (!$scope.isFollowing) {
          $scope.followPost();
        } else {
          Post.unfollow({id: $scope.post.id}, function(res) {
            // remove the follower from list of followers.
            $scope.followers = _.without($scope.followers, _.findWhere($scope.followers, {value: res.value}));
          });
        }
      }

      $scope.toggleEditFollowers = function(event) {
        var isEditing = !$scope.editingFollowers;
        if (isEditing) { // populate potential followers
          $http.get('/users/getpossiblefollowers', {
            params: {postId: $scope.post.id, q: ""}
          }).then(function(res){
            $scope.potentialFollowers = res.data;
          });
        } else { // Save added followers
          _.each($scope.followersToAdd, function(follower) {
            if (!_.findWhere($scope.followers, {value: follower.value})) {
              $scope.followers.push(follower);
              Post.addFollower({id: $scope.post.id, followerId: follower.value});
            }
          });

          $scope.followersToAdd = [];
        }
        $scope.editingFollowers = isEditing;
      }

      $scope.typeaheadOpts = {
        minLength: 1,
        templateUrl: '/ui/app/typeahead-tag-user.tpl.html',
        waitMs: 100
      };

      $scope['delete'] = function() {
        var modalInstance = $modal.open({
          templateUrl: 'confirm_post_deletion.tpl.html',
          controller: function($scope, $modalInstance, postName) {
            $scope.postName = postName;
          },
          resolve: {
            postName: function () {
              return $scope.post.name;
            }
          }
        });
        modalInstance.result.then(function() {
          $scope.removeFn({postToRemove: $scope.post});
          new Post($scope.post).$remove({});
        });
      };

      $scope.showMore = function($event) {
        $scope['short'] = false;
        $scope.truncated = false;
        setText();
        $event.stopPropagation();
        $event.preventDefault();
      };

      var setText = function() {
        var text = $scope.post.description;

        var truncate = $scope['short'] && text.length > 400;

        if (truncate) {
          var cutoff = text.indexOf(' ', 395);
          text = text.substring(0, cutoff) + '... ';
          $scope.truncated = true;
        }

        $scope.truncatedPostText = text;

        $scope.isPostText = text.length > 0;
      }

      var checkIsFollowing = function() {
        $scope.post.numFollowers = $scope.followers.length;
        $scope.isFollowing = _.some($scope.followers, function(val) {
          return val.value == $rootScope.currentUser.id;
        });
      }

      var initialize = function() {
        var loadFollowers = function() {
          if ($scope.post.followersLoaded) {
            $scope.followers = $scope.post.followers;

            $scope.$watchCollection("followers", checkIsFollowing);

          } else {
            Post.followers({id: $scope.post.id}).$promise.then(function(value) {
                  $scope.followers = value;

                  $scope.$watchCollection("followers", checkIsFollowing);
                }
            );
          }
        }

        if ($scope.isCommentsCollapsed) {
          var unwatchCommentsCollapsed = $scope.$watch("isCommentsCollapsed", function(isCollapsed) {
            if (!isCollapsed) {
              loadFollowers();
              unwatchCommentsCollapsed();
            }
          });
        } else {
          loadFollowers();
        }

        // Determines if this post is deletable by currentUser. (is their post OR a moderator)
        $scope.canDelete = ($rootScope.currentUser && $scope.post.user.id == $rootScope.currentUser.id) ||
              ($rootScope.community && $rootScope.community.canModerate);

        $scope.postUrl = $state.href("post.comments", {community: $scope.post.communitySlug, postId: $scope.post.id})

        $scope.voteTooltipText = $scope.post.myVote ? unvoteText : voteText;

        setText();

        unwatchPost();
      }

      var unwatchPost = $scope.$watch('post', function(postPromise) {
        if (postPromise.$promise) { // Case when we are viewing single posts
          // when viewing a single post, we must wait for the promise to resolve
          postPromise.$promise.then(initialize);
        } else if ($scope.post) { // Case when we are viewing posts via ngRepeat
          initialize()
        }
      });
    },
    templateUrl: "/ui/app/hylo_post.tpl.html",
    replace: true
  };
}]);
