module.exports = function ($stateProvider) {
  $stateProvider
  .state('home', {
    url: '/h/home',
    parent: 'main',
    views: {
      main: {
        templateUrl: '/ui/home/show.tpl.html',
        controller: 'HomeCtrl'
      }
    }
  });
};