var controller = function($scope, $analytics, community) {

  $scope.community = community;

  $analytics.eventTrack('Community: Load Community', {
    community_id: community.id,
    community_name: community.name,
    community_slug: community.slug
  });

  // Dalai Lama Fellows, Permaculture Action, Unlikely Allies
  $scope.hideProjectsTab = !_.contains([842, 910, 985], community.id);

};

module.exports = function(angularModule) {
  angularModule.controller('CommunityCtrl', controller);
};