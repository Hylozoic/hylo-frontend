var factory = function($resource) {

  var Seed = $resource("/noo/post/:id/:action", {
    id: '@id'
  }, {
    comment: {
      method: "POST",
      params: {
        action: "comment"
      }
    },
    addFollowers: {
      method: 'POST',
      params: {
        action: 'followers'
      }
    },
    follow: {
      method: 'POST',
      params: {
        action: 'follow'
      }
    },
    unfollow: {
      method: 'POST',
      params: {
        action: 'follow',
        force: 'unfollow'
      }
    },
    queryForCommunity: {
      url: '/noo/community/:communityId/posts'
    },
    queryForUser: {
      url: '/noo/user/:userId/posts'
    },
    queryForNetwork: {
      url: '/noo/network/:id/posts'
    },
    fulfill: {
      method: 'POST',
      url: '/noo/post/:id/fulfill'
    },
    vote: {
      method: 'POST',
      url: '/noo/post/:id/vote'
    },
    findComments: {
      url: '/noo/post/:id/comments',
      isArray: true
    }
  });

  // let's make things a bit more OO around here
  _.extend(Seed.prototype, {
    update: function(params, success, error) {
      return Seed.save(_.extend({id: this.id}, params), success, error);
    },
    fulfill: function(params, success, error) {
      return Seed.fulfill(_.extend({id: this.id}, params), success, error);
    },
    vote: function(params, success, error) {
      return Seed.vote(_.extend({id: this.id}, params), success, error);
    },
    findComments: function(params, success, error) {
      return Seed.findComments(_.extend({id: this.id}, params), success, error);
    },
    unfollow: function(params, success, error) {
      return Seed.unfollow(_.extend({id: this.id}, params), success, error);
    }
  });

  return Seed;
};

module.exports = function(angularModule) {
  angularModule.factory('Seed', factory);
};