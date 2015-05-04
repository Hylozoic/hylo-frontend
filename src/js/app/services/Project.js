var factory = function($resource) {
  return $resource('/noo/project/:slug', {
    slug: '@slug'
  }, {

  });
};

module.exports = function(angularModule) {
  angularModule.factory('Project', factory);
};