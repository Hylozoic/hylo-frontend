var factory = function($resource) {
  var Project = $resource('/noo/project/:slug', {
    slug: '@slug'
  }, {

  });

  _.extend(Project.prototype, {
    // TBD
  });

  return Project;
};

module.exports = function(angularModule) {
  angularModule.factory('Project', factory);
};