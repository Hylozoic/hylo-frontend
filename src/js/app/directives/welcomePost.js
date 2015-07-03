var directive = () => {
  return {
    restrict: 'E',
    scope: {
      post: '='
    },
    controller: 'WelcomePostCtrl',
    templateUrl: '/ui/post/welcome.tpl.html'
  };
};

module.exports = angularModule =>
  angularModule.directive('welcomePost', directive);
