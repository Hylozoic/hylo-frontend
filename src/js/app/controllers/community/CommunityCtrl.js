var controller = function($scope, $analytics, community, currentUser) {

  $scope.community = community;
  $scope.canModerate = currentUser && currentUser.canModerate(community);

  $analytics.eventTrack('Community: Load Community', {
    community_id: community.id,
    community_name: community.name,
    community_slug: community.slug
  });

};

module.exports = function(angularModule) {
  angularModule.controller('CommunityCtrl', controller);
};
