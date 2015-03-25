angular.module("hyloControllers").controller('CommentsCtrl', ['$scope', '$http', 'Post',
  '$log', '$rootScope', '$modal', 'growl', '$window', '$timeout', '$analytics',
  '$q', 'Seed', '$sce', '$filter', 'UserMentions',
  function($scope, $http, Post,
           $log, $rootScope, $modal, growl, $window, $timeout, $analytics,
           $q, Seed, $sce, $filter, UserMentions) {

    var loadComments = function() {
      if (!$scope.post.commentsLoaded) {
        $scope.post.comments = Post.getComments({id: $scope.post.id});
        $scope.post.comments.$promise.then(function() {
          $scope.post.commentsLoaded = true;
        });
      }
    };

    if ($scope.post.$promise) {
      $scope.post.$promise.then(function() {
        loadComments();
      });
    } else {
      loadComments();
    }

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
    };

    $scope.openCommenting = function() {
      $scope.commentOpen = true;
    };

    function closeCommentOnOutsideClick(event, callbackOnClose) {
      var clickedElement = event.target;

      if (!clickedElement) return;

      var clickOnCommentForm = $(clickedElement).closest('.comment-form, .list-group-item').length > 0;

      if (!clickOnCommentForm) {
        callbackOnClose();
        return;
      }
    }

    $scope.create = function() {
      var content = $scope.commentText;
      if (content && content.trim().length > 0) {
        $scope.createDisabled = true;
        Seed.comment({id: $scope.post.id, text: $scope.commentText.trim()}, function(comment, responseHeaders) {
          $scope.post.comments.push(comment);

          $scope.commentText = '';
          $scope.post.numComments++;

          $scope.createDisabled = false;

          closeCommenting();

          $analytics.eventTrack('Post: Comment: Add', {post_id: $scope.post.id, has_mention: $scope.hasMention});

          $scope.hasMention = false;

          if (!_.findWhere($scope.post.followers, {value: comment.user.id})) {
            var user = comment.user;
            user.value = user.id;
            $scope.post.followers.push(user);
          }

        }, function() {
          $scope.createDisabled = false;
          growl.addErrorMessage("Error posting comment.  Please try again later", {ttl: 5000});
          $analytics.eventTrack('Post: Comment: Adding a Comment Failed.', {post_id: $scope.post.id});
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
        $analytics.eventTrack('Post: Comment: Thank', {post_id: $scope.post.id, comment_id: comment.id, state: (comment.isThanked ? 'on' : 'off')})
      });
    };

    $scope['delete'] = function(comment) {

      var modalInstance = $modal.open({
        templateUrl: '/ui/app/confirm_comment_deletion.tpl.html'
      });
      modalInstance.result.then(function() {
        $http.post('/comment/delete', {id: comment.id}).success(function(data, status, headers, config) {
          $log.debug("success", data);
          $analytics.eventTrack('Post: Comment: Delete', {post_id: $scope.post.id, comment_id: comment.id, comment_text: comment.text} );
          $scope.post.comments.splice($scope.post.comments.indexOf(comment), 1);
          $scope.post.numComments--;
        });
        growl.addSuccessMessage("Comment Deleted", {ttl: 5000});
        $log.debug('delete', comment.id);
      });
    };

    $scope.commentTextSafe = function(commentText) {
      var text = require('../services/RichText').present(commentText, {communityId: $scope.post.community.id});
      return $sce.trustAsHtml(text);
    };

    $scope.searchPeople = function(query, community) {
      UserMentions.searchPeople(query, community).$promise.then(function(items) {
        $scope.people = items;
      });
    };

    $scope.getPeopleTextRaw = function(user) {
      $analytics.eventTrack('Post: Comment: @-mention: Lookup', {query: user.name} );
      $scope.hasMention = true;
      return UserMentions.userTextRaw(user);
    }

    $scope.initialCommentText = '<p>&nbsp;</p>';

  }]);
