var eases = require('eases')
var ramjet = require('ramjet')

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
    },
    controller: function ($scope) {
      'ngInject'

      $scope.communities = []

      $scope.expand = function () {
        $scope.expanded = true
      }

      $scope.$on('post-editor-done', () => {
        console.log('caught done')
        $scope.expanded = false
      })
    },
    templateUrl: '/ui/post/inline-edit.tpl.html',
    replace: true,
    link: function (scope, element, attrs) {
      scope.$watch('expanded', val => {
        var children = element.children()
        var input = children[0]
        var editor = children[1]

        // show both (so ramjet can prepare)
        element.addClass('pre-animating')

        ramjet.transform(val ? input : editor, val ? editor : input, {
          done: () => element.removeClass('animating'), // show only form
          easing: eases.cubicInOut,
          duration: 500
        })

        if (val) {
          element.addClass('expanded')
        } else {
          element.removeClass('expanded')
        }

        element.addClass('animating')
        element.removeClass('pre-animating')
      })
    }
  }
}
