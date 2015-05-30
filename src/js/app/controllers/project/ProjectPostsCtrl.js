module.exports = function($scope, project, Seed, growl, Cache, UserCache,
  $analytics, currentUser, postQuery, $stateParams, UserMentions) {
  "ngInject";

  $scope.posts = postQuery.posts;
  $scope.loadMoreDisabled = $scope.posts.length >= postQuery.posts_total;

  var placeholder = "I'm looking for ",
    newRequest = $scope.newRequest = {name: placeholder};

  $scope.searchPeople = function(query) {
    var community = project.visibility == 0 ? project.community : null;
    UserMentions.searchPeople(query, community).$promise.then(function(items) {
      $scope.people = items;
    });
  };

  $scope.getPeopleTextRaw = function(user) {
    $analytics.eventTrack('Post: Add New: @-mention: Lookup', {query: user.name});
    $scope.hasMention = true;
    return UserMentions.userTextRaw(user);
  };

  $scope.addRequest = function() {
    new Seed({
      name: newRequest.name,
      description: newRequest.description,
      projectId: project.id,
      communityId: project.community.id,
      type: 'request'
    }).$save(function() {
      $analytics.eventTrack('Add Post', {
        has_mention: $scope.hasMention,
        community_name: project.community.name,
        community_id: project.community.id,
        project_id: project.id
      });

      // FIXME this is copied from SeedEditCtrl
      Cache.drop('community.posts:' + project.community.id);
      UserCache.posts.clear(currentUser.id);
      UserCache.allPosts.clear(currentUser.id);

      $scope.posts = [];
      $scope.loadMoreDisabled = false;
      $scope.loadMore();
      newRequest.name = placeholder;
      newRequest.description = null;
      $scope.showDescription = false;

    }, function(err) {
      growl.addErrorMessage(err.data);
      $analytics.eventTrack('Add Post Failed');
    });

  };

  $scope.removePost = function(post) {
    growl.addSuccessMessage("Post has been removed: " + post.name, {ttl: 5000});
    $analytics.eventTrack('Post: Remove', {post_name: post.name, post_id: post.id});
    $scope.posts.splice($scope.posts.indexOf(post), 1);
  };

  $scope.loadMore = _.debounce(function() {
    if ($scope.loadMoreDisabled) return;
    $scope.loadMoreDisabled = true;

    project.posts({
      limit: 10,
      offset: $scope.posts.length,
      token: $stateParams.token
    }, function(resp) {
      $scope.posts = _.uniq($scope.posts.concat(resp.posts), function(post) { return post.id });

      if (resp.posts.length > 0 && $scope.posts.length < resp.posts_total)
        $scope.loadMoreDisabled = false;
    });
  });

};
