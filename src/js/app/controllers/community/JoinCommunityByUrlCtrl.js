module.exports = function ($scope, $controller, community, code, currentUser,
  $modal, growl, $timeout) {
  'ngInject'

  $scope.community = community
  $scope.code = code

  var membership = _.find(currentUser.memberships, m => m.community_id === community.id)
  if (membership) {
    $timeout(() => {
      $scope.$state.go('community.posts', {community: membership.community.slug})
      growl.addSuccessMessage('You are already a member of this community.')
    })
  } else {
    // Put functions from JoinCommunityCtrl onto $scope.
    $controller('JoinCommunityCtrl', {$scope: $scope})

    // Validate the community join code from last part of the URL.
    $scope.validateCode()
  }
}
