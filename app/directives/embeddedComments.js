hyloDirectives.directive('embeddedComments', ["Post", '$filter', '$state', '$rootScope', '$log', '$modal', 'User', '$http', '$timeout', 'CommentingService', '$view',
  function(Post, $filter, $state, $rootScope, $log, $modal, User, $http, $timeout, CommentingService, $view) {
    return {
      restrict: 'E',
      scope: {
        post: '=', // the post to generate markup for as a bi-directional model.  See http://docs.angularjs.org/api/ng.$compile
        followPost: '&followFn'
      },
      controller: 'CommentsCtrl',
      templateUrl: "/ui/app/comments.tpl.html",
      replace: true
    };
  }]);
