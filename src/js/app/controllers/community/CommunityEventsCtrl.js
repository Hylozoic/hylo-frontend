var moment = require('moment-timezone')

module.exports = function ($scope, community, currentUser, firstPostQuery, Post, PostManager) {
  'ngInject'

  $scope.currentUser = currentUser

  var postManager = new PostManager({
    firstPage: firstPostQuery,
    scope: $scope,
    attr: 'posts',
    query: function () {
      return Post.queryForCommunity({
        communityId: community.id,
        limit: 10,
        offset: $scope.posts.length,
        type: 'event',
        sort: 'start_time',
        filter: $scope.showPastEvents ? null : 'future'
      }).$promise
    }
  })

  postManager.setup()

  $scope.updateView = function () {
    postManager.reload()
  }

  $scope.eventHeader = function (previous, current) {
    var timeCategory = function (event) {
      var now = moment()
      var eventTime = moment(event.start_time)
      var difference = eventTime.diff(now, 'days')
      if (difference < 0) {
        return 'past'
      } else if (difference === 0) {
        return 'today'
      } else if (difference === 1) {
        return 'tomorrow'
      } else if (difference < 8 && eventTime.week() === now.week()) {
        return 'week'
      } else if (difference < 31 && eventTime.month() === now.month()) {
        return 'month'
      } else {
        return 'future'
      }
    }

    var headerFromCategory = function (category) {
      switch (category) {
        case 'past':
          return 'Past Events'
        case 'today':
          return 'Todays Events'
        case 'tomorrow':
          return 'Tomorrows Events'
        case 'week':
          return 'This Weeks Events'
        case 'month':
          return 'This Months Events'
        case 'future':
          return 'Future Events'
        default:
          return null
      }
    }

    var currentCategory = timeCategory(current)

    if (previous) {
      var previousCategory = timeCategory(previous)
      if (previousCategory === currentCategory) return
    }

    return headerFromCategory(currentCategory)
  }
}
