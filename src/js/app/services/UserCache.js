var factory = function(Seed, Cache) {

  var key = function(userId) {
    return 'user.seeds:' + userId;
  };

  var api = {
    fetchSeeds: function(userId) {
      var cached = Cache.get(key(userId));

      if (cached) {
        return cached;
      } else {
        return Seed.queryForUser({
          userId: userId,
          limit: 10
        }).$promise.then(function(resp) {
          api.setSeeds(userId, resp);
          return resp;
        });
      }
    },
    setSeeds: function(userId, data) {
      Cache.set(key(userId), data, {maxAge: 10 * 60});
    },
    clearSeeds: function(userId) {
      Cache.drop(key(userId));
    }
  };

  return api;
};

module.exports = function(angularModule) {
  angularModule.factory('UserCache', factory);
};