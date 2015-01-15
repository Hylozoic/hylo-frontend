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
    }
  });

  return User;
});

module.exports = function(angularModule) {
  angularModule.factory('User', dependencies);
};
