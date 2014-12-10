var dependencies = ['$resource'];
dependencies.push(function($resource) {
  var Community = $resource('/noo/community/:id', {
    id: '@id'
  }, {
    invite: {
      method: 'POST',
      url: '/noo/community/:id/invite'
    },
    findMembers: {
      url: '/noo/community/:id/members',
      isArray: true
    },
    findModerators: {
      url: '/noo/community/:id/moderators',
      isArray: true
    },
    addModerator: {
      url: '/noo/community/:id/moderators',
      method: 'POST'
    },
    removeModerator: {
      url: '/noo/community/:id/moderator/:user_id',
      method: 'DELETE'
    }
  });

  // let's make things a bit more OO around here
  _.extend(Community.prototype, {
    members: function(params, success, error) {
      return Community.findMembers(_.extend({id: this.id}, params), success, error);
    },
    moderators: function(success, error) {
      return Community.findModerators({id: this.id}, success, error);
    },
    addModerator: function(params, success, error) {
      return Community.addModerator(_.extend({id: this.id}, params), success, error);
    },
    removeModerator: function(params, success, error) {
      return Community.removeModerator(_.extend({id: this.id}, params), success, error);
    }
  });

  return Community;
});

module.exports = function(angularModule) {
  angularModule.factory('Community', dependencies);
};