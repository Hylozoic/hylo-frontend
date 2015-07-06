module.exports = app => app.directive('welcomePost', () => {
  return {
    restrict: 'E',
    replace: true,
    scope: {post: '=', showComments: '=?'},
    controller: 'WelcomePostCtrl',
    templateUrl: '/ui/post/welcome.tpl.html'
  };
});
