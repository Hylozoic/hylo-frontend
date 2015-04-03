var directive = function($compile) {
  return {
    replace: true,
    template: '<div></div>',
    link: function(scope, element, attrs) {
      scope.$watch('contents', function(contents) {
        element.empty();

        if (scope.truncated) {
          var el = angular.element(contents);
          angular.element(el[el.length - 1]).append('&nbsp;<a ng-click="expand()">See More</a>');
          $compile(el)(scope);
          element.append(el);
        } else {
          element.append(contents);
        }
      });
    },
    scope: {
      contents: '=',
      truncated: '=',
      expand: '&'
    }
  }
};

module.exports = function(angularModule) {
  angularModule.directive('seeMore', directive);
};