var factory = function($resource, $rootScope, Project) {
  var User = $resource('/noo/user/:id', {
    id: '@id'
  }, {
    current: {
      url: '/noo/user/me'
    },
    contributions: {
      url: '/noo/user/:id/contributions',
      isArray: true
    },
    thanks: {
      url: '/noo/user/:id/thanks',
      isArray: true
    },
    followedPosts: {
      url: '/noo/user/:id/followed-posts'
    },
    allPosts: {
      url: '/noo/user/:id/all-community-posts'
    },
    login: {
      url: '/noo/login',
      method: 'POST'
    },
    signup: {
      url: '/noo/user',
      method: 'POST'
    },
    status: {
      url: '/noo/user/status'
    },
    requestPasswordChange: {
      url: '/noo/user/password',
      method: 'POST'
    },
    autocomplete: {
      url: '/noo/autocomplete',
      isArray: true,
      params: {
        type: 'people'
      }
    }
  });

  User.loadCurrent = function() {
    return User.current().$promise.then(function(user) {
      var currentUser = (user.id ? user : null);
      $rootScope.currentUser = currentUser;
      window.hyloEnv.provideUser(currentUser);
      return currentUser;
    });
  };

  // let's make things a bit more OO around here
  _.extend(User.prototype, {
    contributions: function(params, success, error) {
      return User.contributions(_.extend({id: this.id}, params), success, error);
    },
    thanks: function(params, success, error) {
      return User.thanks(_.extend({id: this.id}, params), success, error);
    },
    update: function(params, success, error) {
      return User.save(_.extend({id: this.id}, params), success, error);
    },
    posts: function(params, success, error) {
      return User.posts(_.extend({id: this.id}, params), success, error);
    },
    followedPosts: function(params, success, error) {
      return User.followedPosts(_.extend({id: this.id}, params), success, error);
    },
    allPosts: function(params, success, error) {
      return User.allPosts(_.extend({id: this.id}, params), success, error);
    },
    projects: function(params, success, error) {
      return Project.queryForUser(_.extend({id: this.id}, params), success, error);
    },
    firstName: function() {
      return this.name.split(' ')[0];
    },
    canModerate: function(community) {
      return !!_.find(this.memberships, function(membership) {
        return membership.community.id == community.id && membership.role == 1;
      });
    }
  });

  return User;
};

module.exports = function(angularModule) {
  angularModule.factory('User', factory);
};
