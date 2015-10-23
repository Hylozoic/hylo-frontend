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

  var group = function (event) {
    var now = moment()
    var eventTime = moment(event.start_time)
    var difference = eventTime.diff(now, 'days')
    if (difference < 0) {
      return 'Past'
    } else if (difference === 0) {
      return 'Today'
    } else if (difference === 1) {
      return 'Tomorrow'
    } else if (difference < 8 && eventTime.isoWeek() === now.isoWeek()) {
      return 'This Week'
    } else if (difference < 15 && eventTime.isoWeek() === now.isoWeek() + 1) {
      return 'Next Week'
    } else if (difference < 31 && eventTime.month() === now.month()) {
      return 'Month'
    } else {
      return 'Future'
    }
  }

  $scope.eventHeader = function (previous, current) {
    var currentGroup = group(current)

    if (previous) {
      var previousGroup = group(previous)
      if (previousGroup === currentGroup) return
    }

    return currentGroup
  }
}
