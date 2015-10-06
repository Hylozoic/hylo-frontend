var controller = function($scope, $analytics, community, currentUser) {
  $scope.community = community;
  $scope.canModerate = currentUser && currentUser.canModerate(community);

  $analytics.eventTrack('Community: Join Community By URL', {
    community_id: community.id,
    community_name: community.name,
    community_slug: community.slug
  });
};

module.exports = function(angularModule) {
  angularModule.controller('JoinCommunityByUrlCtrl', controller);
};
