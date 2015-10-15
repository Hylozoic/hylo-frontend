var service = function($resource, Project) {
  var Community = $resource('/noo/community/:id', {
    id: '@id'
  }, {
    invite: {
      method: 'POST',
      url: '/noo/community/:id/invite'
    },
    findMembers: {
      url: '/noo/community/:id/members'
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
      url: '/noo/community/:id/moderator/:userId',
      method: 'DELETE'
    },
    removeMember: {
      url: '/noo/community/:id/member/:userId',
      method: 'DELETE'
    },
    leave: {
      url: '/noo/membership/:id',
      method: 'DELETE'
    },
    validate: {
      url: '/noo/community/validate',
      method: 'POST'
    },
    queryForNetwork: {
      url: '/noo/network/:id/communities',
      isArray: true
    },
    search: {
      url: '/noo/community/search',
      isArray: true
    },
    join: {
      url: '/noo/community/code',
      method: 'POST'
    },
    getSettings: {
      url: '/noo/community/:id/settings',
    }
  });

  // let's make things a bit more OO around here
  _.extend(Community.prototype, {
    members: function(params, success, error) {
      return Community.findMembers(_.extend({id: this.id}, params), success, error);
    },
    getSettings: function(success, error) {
      return Community.getSettings({id: this.id}, success, error);
    },
    moderators: function(success, error) {
      return Community.findModerators({id: this.id}, success, error);
    },
    addModerator: function(params, success, error) {
      return Community.addModerator(_.extend({id: this.id}, params), success, error);
    },
    removeModerator: function(params, success, error) {
      return Community.removeModerator(_.extend({id: this.id}, params), success, error);
    },
    update: function(params, success, error) {
      return Community.save(_.extend({id: this.id}, params), success, error);
    },
    invite: function(params, success, error) {
      return Community.invite({id: this.id}, params, success, error);
    },
    removeMember: function(params, success, error) {
      return Community.removeMember(_.extend({id: this.id}, params), success, error);
    },
    projects: function(params, success, error) {
      return Project.queryForCommunity(_.extend({id: this.id}, params), success, error);
    },
    avatarUploadSettings: function() {
      return {
        fieldName: 'avatar_url',
        humanName: 'Icon',
        path: format('community/%s/avatar', this.id || 'new'),
        convert: {width: 160, height: 160, fit: 'crop', rotate: "exif"}
      }
    },
    bannerUploadSettings: function() {
      return {
        fieldName: 'banner_url',
        humanName: 'Banner',
        path: format('community/%s/banner', this.id || 'new'),
        convert: {width: 1600, format: 'jpg', fit: 'max', rotate: "exif"}
      };
    }
  });

  return Community;
};

module.exports = function(angularModule) {
  angularModule.factory('Community', service);
};
