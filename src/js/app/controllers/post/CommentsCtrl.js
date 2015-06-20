var controller = function($scope, $log, $rootScope, $modal, growl, $window, $timeout, $analytics,
  $q, Post, $sce, UserMentions, Comment, $dialog) {

  var post = $scope.post;

  if (!post.comments) {
    $scope.loading = true;

    Post.findComments({id: post.id}, function(comments) {
      post.comments = comments;
      $scope.loading = false;
    }, function(resp) {
      if (_.contains([401, 403], resp.status)) {
        $scope.$emit('unauthorized', {context: 'comment'});
      }
    });
  }

  $scope.canDelete = function(comment) {
    var user = $rootScope.currentUser;
    return user && (comment.user.id == user.id || user.canModerate(post.community));
  };

  $scope.commentOwner = function(comment) {
    return $rootScope.currentUser && $rootScope.currentUser.id == comment.user.id;
  };

  $scope.create = function() {
    if ($scope.commentLength() > 0) {
      $scope.createDisabled = true;
      Post.comment({id: post.id, text: $scope.commentInput.trim()}, function(comment) {
        post.comments.push(comment);
        post.numComments++;

        $scope.commentInput = '';
        $scope.createDisabled = false;
        $scope.commenting = false;
        $scope.hasMention = false;

        $analytics.eventTrack('Post: Comment: Add', {post_id: post.id, has_mention: $scope.hasMention});

        if (!_.findWhere(post.followers, {id: comment.user.id})) {
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
    $dialog.confirm({
      message: 'Are you sure you want to remove this comment? This cannot be undone.'
    }).then(function() {
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

  $scope.commentLength = function() {
    return angular.element('<div>' + ($scope.commentInput || '') + '</div>').text().length;
  }
};

module.exports = function(angularModule) {
  angularModule.controller('CommentsCtrl', controller);
};