var truncate = require('html-truncate');

var directive = function(Seed, $state, $rootScope, $log, $modal, $timeout, $analytics, growl, $dialog, UserCache, Community) {

  var controller = function($scope, $element) {
    $scope.isCommentsCollapsed = ($state.current.data && $state.current.data.singlePost) ? false : true;
    $scope.voteTooltipText = "";
    $scope.followersNotMe = [];

    var currentUser = $rootScope.currentUser;

    $scope.isPostOwner = function() {
      if ($scope.post.user) {
        return currentUser && $scope.post.user.id == currentUser.id;
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
        $analytics.eventTrack('Post: Fulfill', {post_id: $scope.post.id});
      }, function () {

      });
    };

    var voteText = "click to <i class='icon-following'></i> me.";
    var unvoteText = "click to un-<i class='icon-following'></i> me.";

    //Voting is the same thing as "liking"
    $scope.vote = function() {
      var post = $scope.post;
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
    $scope.followersToAdd = []; // builds an array of followers to add after hitting the "complete" button

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

    $scope.toggleJoinPost = function() {
      var user = currentUser;
      if (!user) return;

      if (!$scope.isFollowing) {
        $analytics.eventTrack('Post: Join', {post_id: $scope.post.id});
        $scope.followers.push({
          id: '' + user.id,
          name: user.name,
          avatar_url: user.avatar
        });
        Seed.follow({id: $scope.post.id});
        UserCache.followedSeeds.clear(user.id);
      } else {
        $analytics.eventTrack('Post: Leave', {post_id: $scope.post.id});
        $scope.followers = _.without($scope.followers, _.findWhere($scope.followers, {id: '' + user.id}));
        Seed.follow({id: $scope.post.id});
        UserCache.followedSeeds.remove(user.id, $scope.post.id);
      }
    };

    $scope.toggleEditFollowers = function() {
      $scope.editingFollowers = !$scope.editingFollowers;
      if ($scope.editingFollowers) return;

      // save new followers
      Seed.addFollowers({
        id: $scope.post.id,
        userIds: _.difference(
          _.pluck($scope.followersToAdd, 'id'),
          _.map($scope.post.followers, function(u) { return parseInt(u.id) })
        )
      }, function() {
        _.each($scope.followersToAdd, function(follower) {
          if (!_.findWhere($scope.followers, {id: follower.id + ''})) {
            $scope.followers.push(follower);
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
      return Community.findMembers({id: $scope.post.community.id, autocomplete: search, limit: 5}).$promise;
    };

    $scope['delete'] = function() {
      $dialog.confirm({
        message: 'Are you sure you want to remove "' + $scope.post.name + '"? This cannot be undone.'
      }).then(function() {
        $scope.removeFn({postToRemove: $scope.post});
        new Seed($scope.post).$remove({});
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
      var text = $scope.post.description;
      if (text == null) text = "";

      text = require('../services/RichText').present(text, {communityId: $scope.post.community.id});

      if (!fullLength && text.length > 140) {
        text = truncate(text, 140);
        $scope.truncated = true;
      } else {
        $scope.truncated = false;
      }

      $scope.description = text;
      $scope.hasDescription = text.length > 0;
    };

    var checkIsFollowing = function() {
      var meInFollowers = (currentUser
        ? _.findWhere($scope.followers, {id: currentUser.id})
        : null);

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
      $scope.followers = $scope.post.followers;
      $scope.$watchCollection("followers", checkIsFollowing);

      if ($scope.isCommentsCollapsed) {
        var unwatchCommentsCollapsed = $scope.$watch("isCommentsCollapsed",
          function(isCollapsed) {
            if (!isCollapsed) {
              unwatchCommentsCollapsed();
            }
        });
      }

      $scope.canEdit = currentUser &&
        ($scope.post.user.id == currentUser.id || currentUser.canModerate($scope.post.community));

      $scope.postUrl = $state.href("seed", {community: $scope.post.community.slug, seedId: $scope.post.id});

      $scope.voteTooltipText = $scope.post.myVote ? unvoteText : voteText;

      setText($scope.startExpanded);

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