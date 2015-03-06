var truncate = require('html-truncate');

var controller = function($scope, currentUser, Activity, activity, Comment) {

  $scope.activity = activity;

  $scope.actionText = function(event) {
    switch(event.action) {
      case 'mention':
        return 'mentioned you in a comment on';
      case 'comment':
        return 'commented on';
      case 'followAdd':
        return 'added you to the ' + event.post.type;
    };
  };

  $scope.isThanked = function(comment) {
    return comment && comment.thanks && comment.thanks[0];
  };

  $scope.thank = function(comment) {
    if (_.isEmpty(comment.thanks)) {
      comment.thanks.push({});
    } else {
      comment.thanks.pop();
    }
    Comment.thank({id: comment.id});
  };

  $scope.markAllRead = function() {
    Activity.markAllRead();
    currentUser.notification_count = 0;
    _.each($scope.activity, function(event) {
      event.unread = false;
    });
  };

  $scope.visit = function(event) {
    if (event.unread) {
      Activity.save({id: event.id}, {unread: false});
      event.unread = false;
      currentUser.notification_count -= 1;
    }
    $scope.$state.go('seed', {community: event.post.communities[0].slug, seedId: event.post.id});
  };

  $scope.truncate = truncate;
  $scope.present = require('../../services/RichText').present;
  $scope.isEmpty = _.isEmpty;
};

module.exports = function(angularModule) {
  angularModule.controller('NotificationsCtrl', controller);
};