var factory = function($resource) {
  var Project = $resource('/noo/project/:id', {
    id: '@id'
  }, {
    posts: {
      url: '/noo/project/:id/posts'
    },
    users: {
      url: '/noo/project/:id/users',
      isArray: true
    },
    invite: {
      url: '/noo/project/:id/invite',
      method: 'POST'
    },
    join: {
      url: '/noo/project/:id/join',
      method: 'POST'
    },
    removeUser: {
      url: '/noo/project/:id/user/:userId',
      method: 'DELETE'
    }
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
    },
    isPublic: function() {
      return this.visibility === 1;
    },
    posts: function(params, success, error) {
      return Project.posts(_.extend({id: this.id}, params), success, error);
    },
    users: function(params, success, error) {
      return Project.users(_.extend({id: this.id}, params), success, error);
    },
    invite: function(params, success, error) {
      return Project.invite(_.extend({id: this.id}, params), success, error);
    },
    join: function(params, success, error) {
      return Project.join(_.extend({id: this.id}, params), success, error);
    },
    removeUser: function(params, success, error) {
      return Project.removeUser(_.extend({id: this.id}, params), success, error);
    }
  });

  return Project;
};

module.exports = function(angularModule) {
  angularModule.factory('Project', factory);
};