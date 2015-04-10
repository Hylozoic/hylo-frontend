var controller = function($scope, $http, Post, $log, $rootScope, $modal, growl, $window, $timeout, $analytics,
  $q, Seed, $sce, $filter, UserMentions, Comment) {

  var post = $scope.post;

  if (!post.comments) {
    $scope.loading = true;

    Seed.findComments({id: post.id}, function(comments) {
      post.comments = comments;
      $scope.loading = false;
    });
  }

  $scope.canDelete = function(comment) {
    return ($rootScope.currentUser && comment.user.id == $rootScope.currentUser.id) ||
      ($rootScope.community && $rootScope.community.canModerate);
  };

  $scope.commentOwner = function(comment) {
    return $rootScope.currentUser.id == comment.user.id;
  };

  $scope.create = function() {
    var content = $scope.commentInput;
    if (content && content.trim().length > 0) {
      $scope.createDisabled = true;
      Seed.comment({id: post.id, text: $scope.commentInput.trim()}, function(comment) {
        post.comments.push(comment);
        post.numComments++;

        $scope.commentInput = '';
        $scope.createDisabled = false;
        $scope.commenting = false;
        $scope.hasMention = false;

        $analytics.eventTrack('Post: Comment: Add', {post_id: post.id, has_mention: $scope.hasMention});

        if (!_.findWhere(post.followers, {id: comment.user.id + ''})) {
          post.followers.push(comment.user);
        }

      }, function() {
        $scope.createDisabled = false;
        growl.addErrorMessage("Error posting comment.  Please try again later", {ttl: 5000});
        $analytics.eventTrack('Post: Comment: Adding a Comment Failed.', {post_id: post.id});
      });
    }
  };

  $scope.thank = function(comment) {
    comment.isThanked = !comment.isThanked;

    Comment.thank({id: comment.id}, function() {
      $analytics.eventTrack('Post: Comment: Thank', {
        post_id: post.id,
        comment_id: comment.id,
        state: (comment.isThanked ? 'on' : 'off')
      });
    });
  };

  $scope['delete'] = function(comment) {
    var modalInstance = $modal.open({
      templateUrl: '/ui/app/confirm_comment_deletion.tpl.html'
    });
    modalInstance.result.then(function() {
      growl.addSuccessMessage("Comment deleted.", {ttl: 5000});
      Comment.delete({id: comment.id}, function() {
        $analytics.eventTrack('Post: Comment: Delete', {
          post_id: post.id,
          comment_id: comment.id,
          comment_text: comment.comment_text
        });
        post.comments.splice(post.comments.indexOf(comment), 1);
        post.numComments--;
      });
    });
  };

  $scope.searchPeople = function(query, community) {
    UserMentions.searchPeople(query, community).$promise.then(function(items) {
      $scope.people = items;
    });
  };

  $scope.getPeopleTextRaw = function(user) {
    $analytics.eventTrack('Post: Comment: @-mention: Lookup', {query: user.name});
    $scope.hasMention = true;
    return UserMentions.userTextRaw(user);
  };
};

module.exports = function(angularModule) {
  angularModule.controller('CommentsCtrl', controller);
};