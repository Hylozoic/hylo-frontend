module.exports = function ($scope, growl, $stateParams, $analytics, currentUser, Community, $history, $dialog, UserCache, joinCommunity) {
  'ngInject'
  var user = $scope.user = currentUser
  var editing = $scope.editing = {}
  var edited = $scope.edited = {}

  if (!user.settings.digest_frequency) {
    user.settings.digest_frequency = 'daily'
  }

  $analytics.eventTrack('User Settings: Viewed')

  if ($stateParams.expand === 'password') {
    $scope.expand1 = true
    editing.password = true
  }

  if ($stateParams.expand === 'solicitation') {
    $scope.expand1 = true
  }

  $scope.close = function () {
    if ($history.isEmpty()) {
      $scope.$state.go('profile.posts', {id: user.id})
    } else {
      $history.go(-1)
    }
  }

  $scope.edit = function (field) {
    edited[field] = user[field]
    editing[field] = true
  }

  $scope.cancelEdit = function (field) {
    editing[field] = false
  }

  $scope.saveEdit = function (field, form) {
    if (form && form.$invalid) return

    editing[field] = false
    var data = {}
    data[field] = edited[field]

    user.update(data, function () {
      user[field] = edited[field]
      $analytics.eventTrack('User Settings: Changed ' + field, {user_id: user.id})
      growl.addSuccessMessage('Saved change.')
    }, function (err) {
      growl.addErrorMessage(err.data)
    })
  }

  $scope.toggle = function (field, isInSettings) {
    var data = {}
    if (isInSettings) {
      data.settings = {}
      data.settings[field] = user.settings[field]
    } else {
      data[field] = user[field]
    }
    user.update(data, function () {
      growl.addSuccessMessage('Saved change.')
    }, function (err) {
      growl.addErrorMessage(err.data)
    })
  }

  $scope.leaveCommunity = function (communityId, index) {
    $dialog.confirm({
      message: 'Are you sure you want to leave this community?'
    }).then(function () {
      Community.leave({id: communityId}, function () {
        user.memberships.splice(index, 1)
        UserCache.allPosts.clear(currentUser.id)
      })
    })
  }

  $scope.joinCommunity = joinCommunity
}
