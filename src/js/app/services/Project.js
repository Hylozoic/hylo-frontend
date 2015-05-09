var factory = function($resource) {
  var Project = $resource('/noo/project/:id', {
    id: '@id'
  }, {

  });

  _.extend(Project.prototype, {
    update: function(params, success, error) {
      return Project.save(_.extend({id: this.id}, params), success, error);
    },
    publish: function(success, error) {
      return Project.save({id: this.id, publish: true}, success, error);
    },
    unpublish: function(success, error) {
      return Project.save({id: this.id, unpublish: true}, success, error);
    },
    isPublished: function() {
      return !!this.published_at;
    }
  });

  return Project;
};

module.exports = function(angularModule) {
  angularModule.factory('Project', factory);
};