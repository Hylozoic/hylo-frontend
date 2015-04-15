var directive = function() {
  return {
    restrict: 'E',
    scope: {
      post: '='
    },
    controller: 'CommentsCtrl',
    templateUrl: "/ui/app/comments.tpl.html",
    replace: true
  };
};

module.exports = function(angularModule) {
  angularModule.directive('embeddedComments', directive);
};
