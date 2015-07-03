module.exports = app => app.directive('welcomePost', () => {
  return {
    restrict: 'E',
    scope: {post: '='},
    controller: 'WelcomePostCtrl',
    templateUrl: '/ui/post/welcome.tpl.html'
  };
});
