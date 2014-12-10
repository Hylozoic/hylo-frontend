var dependencies = ['$resource'];
dependencies.push(function($resource) {
  return $resource('/noo/user/:id', {
    id: '@id'
  }, {
    current: {
      url: '/noo/user/me'
    }
  });
});

module.exports = function(angularModule) {
  angularModule.factory('User', dependencies);
};