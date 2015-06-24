module.exports = function($scope, project, Post, Cache, UserCache, growl,
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

  var placeholder;

  if ($scope.isCreator) {
    placeholder = "I'm looking for ";
    $scope.postType = 'request';
  } else {
    placeholder = "I'd like to offer ";
    $scope.postType = 'offer';
  }

  var newPost = $scope.newPost = {name: placeholder};

  $scope.searchPeople = function(query) {
    var community = project.visibility == 0 ? project.community : null;
    UserMentions.searchPeople(query, 'project', project).$promise.then(function(items) {
      $scope.people = items;
    });
  };

  $scope.getPeopleTextRaw = function(user) {
    $analytics.eventTrack('Post: Add New: @-mention: Lookup', {query: user.name});
    $scope.hasMention = true;
    return UserMentions.userTextRaw(user);
  };

  $scope.addPost = function() {
    Post.saveInProject({
      communityId: project.community.id,
      projectId: project.id,
      name: newPost.name,
      description: newPost.description,
      type: $scope.postType
    }, function() {
      $analytics.eventTrack('Add Post', {
        has_mention: $scope.hasMention,
        community_name: project.community.name,
        community_id: project.community.id,
        project_id: project.id
      });

      // FIXME this is copied from PostEditCtrl
      Cache.drop('community.posts:' + project.community.id);
      UserCache.posts.clear(currentUser.id);
      UserCache.allPosts.clear(currentUser.id);

      postManager.reload();
      newPost.name = placeholder;
      newPost.description = null;
      $scope.showDescription = false;

    }, function(err) {
      growl.addErrorMessage(err.data);
      $analytics.eventTrack('Add Post Failed');
    });

  };

};
