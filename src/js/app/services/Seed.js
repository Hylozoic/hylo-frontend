var factory = function($resource) {

  var Seed = $resource("/noo/seed/:id/:action", {
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
    queryForCommunity: {
      method: 'GET',
      url: '/noo/community/:communityId/seeds'
    },
    queryForUser: {
      method: 'GET',
      url: '/noo/user/:userId/seeds'
    },
    fulfill: {
      method: 'POST',
      url: '/noo/seed/:id/fulfill'
    },
    vote: {
      method: 'POST',
      url: '/noo/seed/:id/vote'
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
    }
  });

  return Seed;
};

module.exports = function(angularModule) {
  angularModule.factory('Seed', factory);
};