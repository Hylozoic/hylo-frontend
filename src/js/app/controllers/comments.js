angular.module("hyloControllers").controller('CommentsCtrl', ['$scope', '$http', 'Post', 'User', '$log', '$rootScope', '$modal', 'growl', '$window', 'CommentingService', '$timeout', '$analytics',
  function($scope, $http, Post, User, $log, $rootScope, $modal, growl, $window, CommentingService, $timeout, $analytics) {

    var loadComments = function() {
      if (!$scope.post.commentsLoaded) {
        $scope.comments = Post.getComments({id: $scope.post.id});
        $scope.comments.$promise.then(function() {
          $scope.post.commentsLoaded = true;
        });
      } else {
        $scope.comments = $scope.post.comments;
      }
    }

    if ($scope.post.$promise) {
      $scope.post.$promise.then(function() {
        loadComments();
      });
    } else {
      loadComments();
    }

    $scope.focusInput = CommentingService.isFocused;

    $scope.canDelete = function(comment) {
      return ($rootScope.currentUser && comment.user.id == $rootScope.currentUser.id) ||
        ($rootScope.community && $rootScope.community.canModerate);
    };

    $scope.commentOwner = function(comment) {
      return $rootScope.currentUser.id == comment.user.id;
    };

    $scope.commentOpen = false;

    var closeCommenting = function() {
      $scope.commentOpen = false;
      $($window).off("click.seedComment");
    };

    $scope.openCommenting = function() {
      $scope.commentOpen = true;

      $($window).on("click.seedComment", function (event) {
        $scope.$apply(function() {
          closeCommentOnOutsideClick(event, function() {
            closeCommenting();
          });
        });
      });
    };

    function closeCommentOnOutsideClick(event, callbackOnClose) {
      var clickedElement = event.target;

      if (!clickedElement) return;

      var clickOnCommentForm = $(clickedElement).closest('.comment-form').length > 0

      if (!clickOnCommentForm) {
        callbackOnClose();
        return;
      }
    }

    $scope.create = function() {
      var content = $scope.commentText;
      if (content && content.trim().length > 0) {
        $scope.createDisabled = true;
        Post.comment({id: $scope.post.id, text: $scope.commentText}, function(value, responseHeaders) {
          $scope.comments.push(value);
          $scope.commentText = '';
          $scope.post.numComments++;

          $scope.createDisabled = false;

          closeCommenting();

          $analytics.eventTrack('Add Comment', {post_id: $scope.post.id});

          $scope.followPost();
        });
      }
    };

    /**
     * Thanks, or un-thanks, a comment.
     * @param comment
     */
    $scope.thank = function(comment) {
      comment.isThanked = !comment.isThanked;

      $http.post('/comment/thank', {id: comment.id}).success(function(data, status, headers, config) {
        comment.isThanked = data.isThanked;
        $analytics.eventTrack('Thank Comment', {post_id: $scope.post.id, comment_id: comment.id, state: (comment.isThanked ? 'on' : 'off')})
      });
    };

    $scope['delete'] = function(comment) {

      var modalInstance = $modal.open({
        templateUrl: '/ui/app/confirm_comment_deletion.tpl.html'
      });
      modalInstance.result.then(function() {
        $http.post('/comment/delete', {id: comment.id}).success(function(data, status, headers, config) {
          $log.debug("success", data);
          $scope.comments.splice($scope.comments.indexOf(comment), 1);
          $scope.post.numComments--;
        });
        growl.addSuccessMessage("Comment Deleted", {ttl: 5000});

        $log.debug('delete', comment.id);
      });
    };

//    $scope.onKeypress = function(event) {
//      if (event.which == 13 && event.shiftKey) {
//        event.stopPropagation();
//      } else if (event.which === 13) {
//        var content = $scope.commentText;
//        if (content && content.trim().length > 0) {
//          $scope.create();
//          event.stopPropagation();
//        }
//      }
//    };

  }]);
