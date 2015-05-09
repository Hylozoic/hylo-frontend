var truncate = require('html-truncate');

var directive = function(Seed, $state, $rootScope, $log, $modal, $timeout, $analytics, growl, $dialog, UserCache, Community) {

  var controller = function($scope, $element) {
    $scope.isCommentsCollapsed = !($state.current.data && $state.current.data.singlePost);
    $scope.voteTooltipText = "";
    $scope.followersNotMe = [];
    $scope.followersToAdd = []; // builds an array of followers to add after hitting the "complete" button
    $scope.editingFollowers = false;
    $scope.isFollowing = false;
    $scope.joinPostText = "";
    $scope.onlyAuthorFollowing = false;

    var currentUser = $rootScope.currentUser,
      voteText = "click to <i class='icon-following'></i> me.",
      unvoteText = "click to un-<i class='icon-following'></i> me.",
      post = $scope.post;

    $scope.isPostOwner = function() {
      if (post.user) {
        return currentUser && post.user.id == currentUser.id;
      }
      return false;
    };

    $scope.markFulfilled = function() {
      var modalInstance = $modal.open({
        templateUrl: '/ui/app/fulfillModal.tpl.html',
        controller: "FulfillmentCtrl",
        keyboard: false,
        backdrop: 'static',
        scope: $scope
      });

      modalInstance.result.then(function (selectedItem) {
        // success function
        $analytics.eventTrack('Post: Fulfill', {post_id: post.id});
      }, function () {

      });
    };

    //Voting is the same thing as "liking"
    $scope.vote = function() {
      post.myVote = !post.myVote;
      post.votes += (post.myVote ? 1 : -1);
      $scope.voteTooltipText = post.myVote ? unvoteText : voteText;

      Seed.vote({id: post.id}, function() {
        $analytics.eventTrack('Post: Like', {
          post_id: post.id,
          state: (post.myVote ? 'on' : 'off')
        });
      });
    };

    $scope.onCommentIconClick = function() {
      if ($scope.isCommentsCollapsed) {
        $analytics.eventTrack('Post: Comments: Show', {post_id: post.id});
        $scope.editingFollowers = false;
      }
      $scope.isCommentsCollapsed = !$scope.isCommentsCollapsed;
    };

    $scope.onFollowerIconClick = function() {
      $analytics.eventTrack('Post: Followers: Show', {post_id: post.id});
      $scope.isCommentsCollapsed = true;
      $scope.toggleEditFollowers();
    };

    var toggleJoinPostText = function() {
      if ($scope.isFollowing) {
        $scope.joinPostTooltipText = "Stop receiving notifications";
        $scope.joinPostText = "Unfollow";
      } else {
        $scope.joinPostTooltipText = "Receive notifications";
        $scope.joinPostText = "Follow";
      }
    };

    $scope.toggleJoinPost = function() {
      var user = currentUser;
      if (!user) return;

      if (!$scope.isFollowing) {
        $analytics.eventTrack('Post: Join', {post_id: post.id});
        post.followers.push({
          id: '' + user.id,
          name: user.name,
          avatar_url: user.avatar
        });
        Seed.follow({id: post.id});
        UserCache.followedPosts.clear(user.id);
      } else {
        $analytics.eventTrack('Post: Leave', {post_id: post.id});
        post.followers = _.without(post.followers, _.findWhere(post.followers, {id: '' + user.id}));
        Seed.follow({id: post.id});
        UserCache.followedPosts.remove(user.id, post.id);
      }
    };

    $scope.toggleEditFollowers = function() {
      $scope.editingFollowers = !$scope.editingFollowers;
      if ($scope.editingFollowers) return;

      // save new followers
      Seed.addFollowers({
        id: post.id,
        userIds: _.difference(
          _.pluck($scope.followersToAdd, 'id'),
          _.map(post.followers, function(u) { return parseInt(u.id) })
        )
      }, function() {
        _.each($scope.followersToAdd, function(follower) {
          if (!_.findWhere(post.followers, {id: follower.id + ''})) {
            post.followers.push(follower);
          }
        });
        $analytics.eventTrack('Followers: Add Followers', {num_followers: $scope.followersToAdd.length});
        $scope.followersToAdd = [];
      }, function(err) {
        growl.addErrorMessage(err.data);
        $analytics.eventTrack('Followers: Failed to Add Followers');
      });
    };

    $scope.findMembers = function(search) {
      return Community.findMembers({id: post.community.id, autocomplete: search, limit: 5}).$promise;
    };

    $scope['delete'] = function() {
      $dialog.confirm({
        message: 'Are you sure you want to remove "' + post.name + '"? This cannot be undone.'
      }).then(function() {
        $scope.removeFn({postToRemove: post});
        new Seed(post).$remove({});
      });
    };

    $scope.showMore = function() {
      setText(true);
    };

    $scope.openFollowers = function(isOpen) {
      if (isOpen) {
        $analytics.eventTrack('Followers: Viewed List of Followers', {num_followers: $scope.followersNotMe.length});
      }
    };

    var setText = function(fullLength) {
      var text = post.description;
      if (!text) text = "";

      text = require('../services/RichText').present(text);

      if (!fullLength && text.length > 140) {
        text = truncate(text, 140);
        $scope.truncated = true;
      } else {
        $scope.truncated = false;
      }

      $scope.description = text;
      $scope.hasDescription = angular.element(text).text().trim().length > 0;
    };

    $scope.$watchCollection("post.followers", function() {
      var meInFollowers = (currentUser && _.findWhere(post.followers, {id: currentUser.id}));

      if (meInFollowers) {
        $scope.followersNotMe = _.without(post.followers, meInFollowers);
        $scope.isFollowing = true;
      } else {
        $scope.followersNotMe = post.followers;
        $scope.isFollowing = false;
      }

      //If the only person following the post is the author we can hide the following status in the post
      var firstFollower = _.first(post.followers);
      $scope.onlyAuthorFollowing = (post.followers.length == 1 && firstFollower.name === post.user.name);

      toggleJoinPostText();
    });

    $scope.canEdit = currentUser && (post.user.id == currentUser.id || currentUser.canModerate(post.community));
    $scope.voteTooltipText = post.myVote ? unvoteText : voteText;
    setText($scope.startExpanded);

    var now = new Date();
    $scope.showUpdateTime = (now - new Date(post.last_updated)) < (now - new Date(post.creation_date)) * 0.8;

    $scope.truncate = truncate;

  };

  return {
    restrict: 'E',
    scope: {
      post: '=', // the post to generate markup for as a bi-directional model.  See http://docs.angularjs.org/api/ng.$compile
      removeFn: '&',
      startExpanded: '='
    },
    controller: controller,
    templateUrl: "/ui/app/hylo_post.tpl.html",
    replace: true
  };

};

module.exports = function(angularModule) {
  angularModule.directive('hyloPost', directive);
};