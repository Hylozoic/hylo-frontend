module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      communities: '='
    },
    controller: function ($scope) {
      'ngInject'

      $scope.expand = function () {
        $scope.expanded = true
      }

      $scope.$on('post-editor-done', () => {
        $scope.expanded = false
      })
    },
    templateUrl: '/ui/post/inline-edit.tpl.html',
    replace: true,
    link: function (scope, element, attrs) {
      element.on('click', function () {
        if (!scope.expanded) {
          scope.$apply(() => scope.expanded = true)
        }
      })

      scope.$watch('expanded', val => {
        if (val) {
          element.addClass('expanded')
        } else {
          element.removeClass('expanded')
        }
      })
    }
  }
}
