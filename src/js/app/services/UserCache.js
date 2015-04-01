// FIXME: this cries out for DRYing

var factory = function(Seed, User, Cache) {

  var api = {
    seeds: {
      key: function(userId) {
        return 'user.seeds:' + userId;
      },
      fetch: function(userId) {
        var cached = Cache.get(api.seeds.key(userId));

        if (cached) {
          return cached;
        } else {
          return Seed.queryForUser({
            userId: userId,
            limit: 10
          }).$promise.then(function(resp) {
            api.seeds.set(userId, resp);
            return resp;
          });
        }
      },
      set: function(userId, data) {
        Cache.set(api.seeds.key(userId), data, {maxAge: 10 * 60});
      },
      clear: function(userId) {
        Cache.drop(api.seeds.key(userId));
      }
    },

    followedSeeds: {
      key: function(userId) {
        return 'user.followedSeeds:' + userId;
      },
      fetch: function(user) {
        var cached = Cache.get(api.followedSeeds.key(user.id));

        if (cached) {
          return cached;
        } else {
          return user.followedSeeds({
            limit: 10
          }).$promise.then(function(resp) {
            api.followedSeeds.set(user.id, resp);
            return resp;
          });
        }
      },
      set: function(userId, data) {
        Cache.set(api.followedSeeds.key(userId), data, {maxAge: 10 * 60});
      },
      remove: function(userId, seedId) {
        var data = Cache.get(api.followedSeeds.key(userId));
        if (!data) return;

        var post = _.find(data.seeds, function(seed) {
          return seed.id == seedId;
        });
        if (!post) return;

        data.seeds.splice(data.seeds.indexOf(post), 1);
        data.seeds_total -= 1;
      },
      clear: function(userId) {
        Cache.drop(api.followedSeeds.key(userId));
      }
    },

    allSeeds: {
      key: function(userId) {
        return 'user.allSeeds:' + userId;
      },
      fetch: function(user) {
        var cached = Cache.get(api.allSeeds.key(user.id));

        if (cached) {
          return cached;
        } else {
          return user.allSeeds({
            limit: 10
          }).$promise.then(function(resp) {
            api.allSeeds.set(user.id, resp);
            return resp;
          });
        }
      },
      set: function(userId, data) {
        Cache.set(api.allSeeds.key(userId), data, {maxAge: 10 * 60});
      },
      clear: function(userId) {
        Cache.drop(api.allSeeds.key(userId));
      }
    }
  };

  return api;
};

module.exports = function(angularModule) {
  angularModule.factory('UserCache', factory);
};