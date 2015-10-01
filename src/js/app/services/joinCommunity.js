var service = function($modal) {
  return function() {
    $modal.open({
      templateUrl: '/ui/shared/join-community.tpl.html',
      controller: 'JoinCommunityCtrl'
    });
  };
};

module.exports = function(angularModule) {
  angularModule.factory('joinCommunity', service)
}
