var factory = function ($resource) {
  var Post = $resource('/noo/post/:id/:action', {
    id: '@id',
    projectId: '@projectId'
  }, {
    comment: {
      method: 'POST',
      params: {
        action: 'comment'
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
    },
    saveInProject: {
      url: '/noo/project/:projectId/posts',
      method: 'POST'
    },
    complain: {
      method: 'POST',
      url: '/noo/post/:id/complain'
    }
  })

  Post.relevantCommunity = function (post, user) {
    if (!user) return post.communities[0]
    var ids = _.pluck(user.memberships, 'community_id')
    return _.find(post.communities, c => _.contains(ids, c.id))
  }

  // let's make things a bit more OO around here
  _.extend(Post.prototype, {
    update: function (params, success, error) {
      return Post.save(_.extend({id: this.id}, params), success, error)
    },
    fulfill: function (params, success, error) {
      return Post.fulfill(_.extend({id: this.id}, params), success, error)
    },
    vote: function (params, success, error) {
      return Post.vote(_.extend({id: this.id}, params), success, error)
    },
    findComments: function (params, success, error) {
      return Post.findComments(_.extend({id: this.id}, params), success, error)
    },
    unfollow: function (params, success, error) {
      return Post.unfollow(_.extend({id: this.id}, params), success, error)
    }
  })

  return Post
}

module.exports = function (angularModule) {
  angularModule.factory('Post', factory)
}
