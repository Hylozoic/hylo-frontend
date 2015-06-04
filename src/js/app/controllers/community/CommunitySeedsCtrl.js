var controller = function($scope, Cache, Seed, growl, $analytics, community, onboarding, firstPostQuery, PostManager) {

  $scope.onboarding = onboarding;
  $scope.community = community;

  var pager = new PostManager({
    firstPage: firstPostQuery,
    scope: $scope,
    attr: 'posts',
    cache: function(posts, total) {
      Cache.set('community.posts:' + community.id, {
        posts: posts,
        posts_total: total
      }, {maxAge: 10 * 60});
    },
    query: function() {
      return Seed.queryForCommunity({
        communityId: community.id,
        limit: 10,
        offset: $scope.posts.length,
        type: $scope.selected.filter.value,
        sort: $scope.selected.sort.value
      }).$promise;
    }
  });

  pager.setup();

  $scope.selectOptions = {
    sort: [
      {label: 'Recent', value: 'recent'},
      {label: 'Top', value: 'top'}
    ],
    filter: [
      {label: 'All Seeds', value: 'all'},
      {label: 'Intentions', value: 'intention'},
      {label: 'Offers', value: 'offer'},
      {label: 'Requests', value: 'request'}
    ]
  };

  $scope.selected = {
    sort: $scope.selectOptions.sort[0],
    filter: $scope.selectOptions.filter[0]
  };

  $scope.select = function(type, value) {
    $scope.selected[type] = _.find(
      $scope.selectOptions[type],
      function(x) { return x.value === value }
    );

    pager.reload();
  };

};

module.exports = function(angularModule) {
  angularModule.controller('CommunitySeedsCtrl', controller);
};