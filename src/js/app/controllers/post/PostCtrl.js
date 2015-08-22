var striptags = require('striptags')
var truncate = require('html-truncate')

var controller = function ($scope, Post, growl, post, currentUser, $stateParams, Meta, $history) {
  $scope.post = post

  Meta.set({
    og: {
      url: window.location.href,
      title: post.name,
      image: post.image_url,
      description: truncate(striptags(post.description || ''), 140)
    }
  })

  $scope.postdeleted = function (deletedPost) {
    growl.addSuccessMessage('Post has been removed: ' + deletedPost.name, {ttl: 5000})
    if ($history.isEmpty()) {
      $scope.$state.go('community.posts', {community: deletedPost.communities[0].slug})
    } else {
      $history.go(-1);
    }
  }

  if ($stateParams.action === 'unfollow') {
    post.unfollow({}, function () {
      post.followers = _.without(post.followers, _.findWhere(post.followers, {id: currentUser.id}))
      growl.addSuccessMessage('You are no longer following this post.', {ttl: 8000})
    })
  }
}

module.exports = function (angularModule) {
  angularModule.controller('PostCtrl', controller)
}
