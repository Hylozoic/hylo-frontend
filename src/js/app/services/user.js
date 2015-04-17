var dependencies = ['$resource'];
dependencies.push(function($resource) {
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
    followedSeeds: {
      url: '/noo/user/:id/followed-seeds'
    },
    allSeeds: {
      url: '/noo/user/:id/all-community-seeds'
    },
    login: {
      url: '/noo/login',
      method: 'POST'
    }
  });

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
    seeds: function(params, success, error) {
      return User.seeds(_.extend({id: this.id}, params), success, error);
    },
    followedSeeds: function(params, success, error) {
      return User.followedSeeds(_.extend({id: this.id}, params), success, error);
    },
    allSeeds: function(params, success, error) {
      return User.allSeeds(_.extend({id: this.id}, params), success, error);
    },
    firstName: function() {
      return this.name.split(' ')[0];
    }
  });

  return User;
});

module.exports = function(angularModule) {
  angularModule.factory('User', dependencies);
};
