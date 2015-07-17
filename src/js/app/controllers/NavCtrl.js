module.exports = function($scope, $modal, CurrentUser) {
  'ngInject';

  $scope.currentUser = CurrentUser.get();

  $scope.joinCommunity = function() {
    $modal.open({
      templateUrl: '/ui/shared/join-community.tpl.html',
      controller: 'JoinCommunityCtrl'
    });
  };

};
