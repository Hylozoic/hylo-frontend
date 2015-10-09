module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      post: '=', // the post to generate markup for as a bi-directional model.  See http://docs.angularjs.org/api/ng.$compile
      communities: '=',
      startingType: '='
    },
    controller: 'PostEditCtrl',
    templateUrl: '/ui/post/edit.tpl.html',
    replace: true
  }
}
