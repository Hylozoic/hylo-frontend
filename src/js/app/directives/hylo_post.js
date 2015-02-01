var linkify = require('html-linkify'),
  truncate = require('html-truncate');

angular.module("hyloDirectives").directive('hyloPost', ["Post",
  '$filter', '$state', '$rootScope', '$log', '$modal', '$http',
  '$timeout', '$window', '$analytics', '$sce',
  function(Post,
           $filter, $state, $rootScope, $log, $modal, $http,
           $timeout, $window, $analytics, $sce) {
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
      $scope.followersNotMe = [];

      $scope.isPostOwner = function() {
        if ($scope.post.user) {
          return $scope.post.user.id == $rootScope.currentUser.id;
        }
        return false;
      };

      $scope.markFulfilled = function() {
        var modalScope = $rootScope.$new(true);
        // Map the top contributors as all the unique commentors on the post
        modalScope.topContributors = _.map(
          _.uniq(_.pluck($scope.comments, 'user'), false, _.property("id")), _.property('id')
        );

        modalScope.post = $scope.post;

        var modalInstance = $modal.open({
          templateUrl: '/ui/app/fulfillModal.tpl.html',
          controller: "FulfillModalCtrl",
          keyboard: false,
          backdrop: 'static',
          scope: modalScope
        });

        modalInstance.result.then(function (selectedItem) {
          // success function
          $analytics.eventTrack('Post: Fulfill', {post_id: $scope.post.id});
        }, function () {

        });
      };

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
      };

      $scope.gotoSinglePost = function() {
        $analytics.eventTrack('Post: Load Single Post', {post_id: $scope.post.id});
        $state.go('post.comments', {community: $scope.post.communitySlug, postId: $scope.post.id})
      };

      var voteText = "click to <i class='icon-following'></i> me.";
      var unvoteText = "click to un-<i class='icon-following'></i> me.";

      //Voting is the same thing as "liking"
      $scope.vote = function() {
        var thisPost = $scope.post;
        var newVoteState = true; // TODO allow de-voting: !thisPost.myVote;

        thisPost.myVote = !thisPost.myVote;
        $scope.voteTooltipText = thisPost.myVote ? unvoteText : voteText;

        Post.vote({id: thisPost.id}, function(value, responseHeaders) {
          thisPost.votes = value.numVotes;
          thisPost.myVote = value.myVote;
          $analytics.eventTrack('Post: Like', {post_id: $scope.post.id, state: (thisPost.myVote ? 'on' : 'off')})
        });
      };

      $scope.onCommentIconClick = function() {
        if ($scope.isCommentsCollapsed) {
          $analytics.eventTrack('Post: Comments: Show', {post_id: $scope.post.id});
          $scope.editingFollowers = false;
        }
        $scope.isCommentsCollapsed = !$scope.isCommentsCollapsed;
      };

      $scope.onFollowerIconClick = function() {
        $analytics.eventTrack('Post: Followers: Show', {post_id: $scope.post.id});
        $scope.isCommentsCollapsed = true;
        $scope.toggleEditFollowers();
      };

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
      $scope.joinPostText = "";

      $scope.onlyAuthorFollowing = false;


      var toggleJoinPostText = function() {
        if ($scope.isFollowing) {
          $scope.joinPostTooltipText = "Stop receiving notifications";
          $scope.joinPostText = "Leave";
        } else {
          $scope.joinPostTooltipText = "Receive notifications";
          $scope.joinPostText = "Join";
        }
      };

      $scope.followPost = function() {
        Post.follow({id: $scope.post.id}, function(res) {
          $scope.followers.push(res);
        });
      };

      $scope.toggleJoinPost = function() {
        if (!$scope.isFollowing) {
          $analytics.eventTrack('Post: Join: Follow', {post_id: $scope.post.id});
          $scope.followPost();
        } else {
          Post.unfollow({id: $scope.post.id}, function(res) {
            $analytics.eventTrack('Post: Join: Unfollow', {post_id: $scope.post.id});
            // remove the follower from list of followers.
            $scope.followers = _.without($scope.followers, _.findWhere($scope.followers, {value: res.value}));
          });
        }
      };

      $scope.toggleEditFollowers = function() {
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
      };

      $scope.typeaheadOpts = {
        minLength: 1,
        templateUrl: '/ui/app/typeahead-tag-user.tpl.html',
        waitMs: 100
      };

      $scope['delete'] = function() {
        var modalInstance = $modal.open({
          templateUrl: '/ui/app/confirm_post_deletion.tpl.html',
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
        $scope.truncated = false;
        setText(true);
        $event.stopPropagation();
        $event.preventDefault();
      };

      $scope.openFollowers = function(isOpen) {
        if (isOpen) {
          $analytics.eventTrack('Followers: Viewed List of Followers', {num_followers: $scope.followersNotMe.length});
        }
      };

      var setText = function(fullLength) {
        var text = $scope.post.description;
        if (text == null) text = "";

        text = linkify(text, {escape: false, attributes: {target: '_blank'}});

        if (!fullLength && text.length > 400) {
          text = truncate(text, 397);
          $scope.truncated = true;
        }

        $scope.truncatedPostText = $sce.trustAsHtml(text);
        $scope.isPostText = text.length > 0;
      };

      var checkIsFollowing = function() {
        //get number of followers
        $scope.post.numFollowers = $scope.followers.length;

        var meInFollowers = _.findWhere($scope.followers, {value: $rootScope.currentUser.id});

        if (meInFollowers) {
          $scope.followersNotMe = _.without($scope.followers, meInFollowers);
          $scope.isFollowing = true;
        } else {
          $scope.followersNotMe = $scope.followers;
          $scope.isFollowing = false;
        }

        //If the only person following the post is the author we can hide the following status in the post
        var firstFollower = _.first($scope.followers);
        $scope.onlyAuthorFollowing = ($scope.followers.length == 1 && firstFollower.name === $scope.post.user.name);

        toggleJoinPostText();
      };

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
        };

        if ($scope.isCommentsCollapsed) {
          var unwatchCommentsCollapsed = $scope.$watch("isCommentsCollapsed",
            function(isCollapsed) {
              if (!isCollapsed) {
                unwatchCommentsCollapsed();
              }
          });
        }

        loadFollowers();

        // Determines if this post is deletable by currentUser. (is their post OR a moderator)
        $scope.canDelete = ($rootScope.currentUser && $scope.post.user.id == $rootScope.currentUser.id) ||
              ($rootScope.community && $rootScope.community.canModerate);

        $scope.postUrl = $state.href("post.comments", {community: $scope.post.communitySlug, postId: $scope.post.id});

        $scope.voteTooltipText = $scope.post.myVote ? unvoteText : voteText;

        setText(false);

        unwatchPost();
      };

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
