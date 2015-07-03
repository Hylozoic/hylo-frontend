var directive = function() {
  return {
    restrict: 'E',
    scope: {
      post: '=', // the post to generate markup for as a bi-directional model.  See http://docs.angularjs.org/api/ng.$compile
      removeFn: '&',
      startExpanded: '='
    },
    controller: 'PostCardCtrl',
    templateUrl: "/ui/app/hylo_post.tpl.html",
    replace: true,
    link: function(scope, element, attrs) {
      element.addClass(scope.post.type);
      if (scope.post.fulfilled_at) element.addClass('fulfilled');
    }
  };
};

module.exports = function(angularModule) {
  angularModule.directive('postCard', directive);
};
