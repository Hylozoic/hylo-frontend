// FIXME: this cries out for DRYing

var factory = function(Post, User, Cache) {

  var api = {
    posts: {
      key: function(userId) {
        return 'user.posts:' + userId;
      },
      fetch: function(userId) {
        var cached = Cache.get(api.posts.key(userId));

        if (cached) {
          return cached;
        } else {
          return Post.queryForUser({
            userId: userId,
            limit: 10
          }).$promise.then(function(resp) {
            api.posts.set(userId, resp);
            return resp;
          });
        }
      },
      set: function(userId, data) {
        Cache.set(api.posts.key(userId), data, {maxAge: 10 * 60});
      },
      clear: function(userId) {
        Cache.drop(api.posts.key(userId));
      }
    },

    followedPosts: {
      key: function(userId) {
        return 'user.followedPosts:' + userId;
      },
      fetch: function(user) {
        var cached = Cache.get(api.followedPosts.key(user.id));

        if (cached) {
          return cached;
        } else {
          return user.followedPosts({
            limit: 10
          }).$promise.then(function(resp) {
            api.followedPosts.set(user.id, resp);
            return resp;
          });
        }
      },
      set: function(userId, data) {
        Cache.set(api.followedPosts.key(userId), data, {maxAge: 10 * 60});
      },
      remove: function(userId, postId) {
        var data = Cache.get(api.followedPosts.key(userId));
        if (!data) return;

        var post = _.find(data.posts, function(p) {
          return p.id == postId;
        });
        if (!post) return;

        data.posts.splice(data.posts.indexOf(post), 1);
        data.posts_total -= 1;
      },
      clear: function(userId) {
        Cache.drop(api.followedPosts.key(userId));
      }
    },

    allPosts: {
      key: function(userId) {
        return 'user.allPosts:' + userId;
      },
      fetch: function(user) {
        var cached = Cache.get(api.allPosts.key(user.id));

        if (cached) {
          return cached;
        } else {
          return user.allPosts({
            limit: 10
          }).$promise.then(function(resp) {
            api.allPosts.set(user.id, resp);
            return resp;
          });
        }
      },
      set: function(userId, data) {
        Cache.set(api.allPosts.key(userId), data, {maxAge: 10 * 60});
      },
      clear: function(userId) {
        Cache.drop(api.allPosts.key(userId));
      }
    }
  };

  return api;
};

module.exports = function(angularModule) {
  angularModule.factory('UserCache', factory);
};