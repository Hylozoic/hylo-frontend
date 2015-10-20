/*
  encapsulate the pagination logic for posts.

  this hardcodes the names "loadMoreDisabled", "loadMore", and "removePost",
  which couples it to the templates that use the infinite-scroll and post-card directives.

  it also assumes the server response will contain "posts" and "posts_total" keys,
  which couples it to our particular server implementation.
 */

module.exports = function (growl, $analytics, $timeout) {
  'ngInject'

  var PostManager = function (opts) {
    var firstPage = opts.firstPage
    this.opts = opts
    this.attr = opts.attr
    this.scope = opts.scope
    this.scope[this.attr] = firstPage.posts
    this.scope.loadMoreDisabled = this.scope.posts.length >= firstPage.posts_total
    if (opts.hideWelcomePosts) this.scope.hideWelcomePosts = true
  }

  _.extend(PostManager.prototype, {
    setup: function () {
      this.scope.loadMore = _.debounce(function () {
        if (this.scope.loadMoreDisabled) return
        this.scope.loadMoreDisabled = true
        this.scope.loadingPosts = true

        this.opts.query().then(this._append.bind(this))
      }.bind(this), 200)

      this.scope.removePost = function (postToRemove) {
        growl.addSuccessMessage('Post has been removed: ' + postToRemove.name, {ttl: 5000})
        $analytics.eventTrack('Post: Remove', {post_name: postToRemove.name, post_id: postToRemove.id})
        var index = this.scope[this.attr].indexOf(postToRemove)
        this.scope[this.attr].splice(index, 1)
      }.bind(this)
    },

    reload: function () {
      this.scope.loadingPosts = true
      this.scope[this.attr] = []
      this.scope.loadMoreDisabled = false
      this.scope.loadMore()
    },

    _append: function (resp) {
      this.scope.loadingPosts = false

      this.scope[this.attr] = _.uniq(
        this.scope[this.attr].concat(resp.posts),
        post => post.id
      )

      if (this.opts.cache) {
        this.opts.cache(this.scope[this.attr], resp.posts_total)
      }

      if (resp.posts.length > 0 && this.scope[this.attr].length < resp.posts_total) {
        $timeout(() => this.scope.loadMoreDisabled = false)
      }
    }

  })

  return PostManager
}
