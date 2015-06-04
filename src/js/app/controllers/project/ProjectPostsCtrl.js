module.exports = function($scope, project, Seed, Cache, UserCache,
  $analytics, currentUser, postQuery, $stateParams, UserMentions, PostManager) {
  "ngInject";

  var postManager = new PostManager({
    firstPage: postQuery,
    scope: $scope,
    attr: 'posts',
    query: function() {
      return project.posts({
        limit: 10,
        offset: $scope.posts.length,
        token: $stateParams.token
      }).$promise;
    }
  });

  postManager.setup();

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

      postManager.reload();
      newRequest.name = placeholder;
      newRequest.description = null;
      $scope.showDescription = false;

    }, function(err) {
      growl.addErrorMessage(err.data);
      $analytics.eventTrack('Add Post Failed');
    });

  };

};
