var factory = function($resource, Community, User) {
  var Network = $resource('/noo/network/:id', {
    id: '@id'
  });

  _.extend(Network.prototype, {
    communities: function(params, success, error) {
      return Community.queryForNetwork(_.extend({id: this.id}, params), success, error);
    },
    members: function(params, success, error) {
      return User.queryForNetwork(_.extend({id: this.id}, params), success, error);
    }
  });

  return Network;
};

module.exports = function(angularModule) {
  angularModule.factory('Network', factory);
};
