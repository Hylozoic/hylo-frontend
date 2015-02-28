// remove trailing slashes from paths
var rule = function ($injector, $location) {
  var path = $location.url();

  if (path[path.length - 1] === '/') {
    return path.substring(0, path.length - 1);
  }

  if (path.indexOf('/?') > -1) {
    return path.replace('/?', '?');
  }
};

module.exports = function (angularModule) {
  angularModule.config(function ($urlRouterProvider) {
    $urlRouterProvider.rule(rule);
  });
};