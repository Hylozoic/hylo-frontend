var factory = function($resource, $state, Project, $timeout, $q) {
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
    },
    queryForNetwork: {
      url: '/noo/network/:id/members'
    }
  });

  // load this as a "resolve" dependency for a route.
  // if the route has children with resolve dependencies
  // that call resources requiring login,
  // add it as a dependency of those.
  // (see e.g. routes/home.js)
  User.requireLogin = function(user) {
    if (user) return;

    var nextParams = {next: format('%s%s', window.location.pathname, window.location.search)}

    $timeout(() => $state.go('login', nextParams));
    var deferred = $q.defer();
    deferred.reject('login required'); // this string is expected in app/index.js
    return deferred.promise;
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
      if (this.is_admin) return true;

      return !!_.find(this.memberships, function(membership) {
        return membership.community.id == community.id && membership.role == 1;
      });
    },
    inCommunity: function() {
      return !_.isEmpty(this.memberships);
    },
    lastUsedMembership: function() {
      var reverseDate = m => -Date.parse(m.last_viewed_at || '2001-01-01');
      return _.sortBy(this.memberships, reverseDate)[0];
    }
  });

  return User;
};

module.exports = function(angularModule) {
  angularModule.factory('User', factory);
};
