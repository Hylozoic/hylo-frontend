var filepickerUpload = require('../../services/filepickerUpload');

var controller = function($scope, currentUser, community, Post, growl, $analytics, $history,
  UserMentions, post, $state, $rootScope, Cache, UserCache) {

  var prefixes = {
    intention: "I'd like to create",
    offer: "I'd like to share",
    request: "I'm looking for"
  };

  // TODO get multiple placeholders to work
  var placeholders = {
    intention: "Add more detail about this intention. What help do you need to make it happen?",
    offer: 'Add more detail about this offer. Is it in limited supply? Do you wish to be compensated?',
    request: 'Add more detail about what you need. Is it urgent? What can you offer in exchange?'
  };

  $scope.switchPostType = function(postType) {
  	$scope.postType = postType;
    $scope.title = prefixes[postType] + ' ';
    $scope.descriptionPlaceholder = placeholders[postType];
  };

  $scope.close = function() {
    $rootScope.postEditProgress = null;
    if ($history.isEmpty()) {
      $state.go('community.posts', {community: community.slug});
    } else {
      $history.go(-1);
    }
  };

  $scope.addImage = function() {
    $scope.addingImage = true;

    function finish() {
      $scope.addingImage = false;
      $scope.$apply();
    }

    filepickerUpload({
      path: format('user/%s/seeds', currentUser.id),
      convert: {width: 800, format: 'jpg', fit: 'max', rotate: "exif"},
      success: function(url) {
        $scope.imageUrl = url;
        $scope.imageRemoved = false;
        finish();
      },
      failure: function(err) {
        finish();
      }
    });
  };

  $scope.removeImage = function() {
    delete $scope.imageUrl;
    $scope.imageRemoved = true;
  };

  var validate = function() {
    var invalidTitle = _.contains(_.values(prefixes), $scope.title.trim());

    // TODO show errors in UI
    if (invalidTitle) alert('Please fill in a title');

    return !invalidTitle;
  };

  var clearCache = function() {
    Cache.drop('community.posts:' + community.id);
    UserCache.posts.clear(currentUser.id);
    UserCache.allPosts.clear(currentUser.id);
  };

  var update = function(data) {
    post.update(data, function() {
      $analytics.eventTrack('Edit Post', {
        has_mention: $scope.hasMention,
        community_name: community.name,
        community_id: community.id,
        type: $scope.postType
      });
      clearCache();
      $state.go('post', {community: community.slug, postId: post.id});
      growl.addSuccessMessage('Post updated.');
    }, function(err) {
      $scope.saving = false;
      growl.addErrorMessage(err.data);
      $analytics.eventTrack('Edit Post Failed');
    });
  };

  var create = function(data) {
    new Post(data).$save(function() {
      $analytics.eventTrack('Add Post', {has_mention: $scope.hasMention, community_name: community.name, community_id: community.id});
      clearCache();
      $scope.close();
      growl.addSuccessMessage('Post created!');
    }, function(err) {
      $scope.saving = false;
      growl.addErrorMessage(err.data);
      $analytics.eventTrack('Add Post Failed');
    });
  };

  $scope.save = function() {
    if (!validate()) return;
    $scope.saving = true;

    var data = {
      name: $scope.title,
      description: $scope.description,
      type: $scope.postType,
      communityId: community.id,
      imageUrl: $scope.imageUrl,
      imageRemoved: $scope.imageRemoved
    };
    ($scope.editing ? update : create)(data);
  };

  $scope.searchPeople = function(query) {
    UserMentions.searchPeople(query, 'community', community.id).$promise.then(function(items) {
      $scope.people = items;
    });
  };

  $scope.getPeopleTextRaw = function(user) {
    $analytics.eventTrack('Post: Add New: @-mention: Lookup', {query: user.name});
    $scope.hasMention = true;
    return UserMentions.userTextRaw(user);
  };

  $scope.storeProgress = function() {
    $rootScope.postEditProgress = {
      title: $scope.title,
      description: $scope.description,
      type: $scope.postType
    };
  };

  if (post) {
    $scope.editing = true;
    $scope.switchPostType(post.type);
    $scope.title = post.name;
    if (post.media[0]) {
      $scope.imageUrl = post.media[0].url;
    }

    if (post.description.substring(0, 3) === '<p>') {
      $scope.description = post.description;
    } else {
      $scope.description = format('<p>%s</p>', post.description);
    }
  } else if ($rootScope.postEditProgress) {
    $scope.switchPostType($rootScope.postEditProgress.type);
    $scope.title = $rootScope.postEditProgress.title;
    $scope.description = $rootScope.postEditProgress.description;

  } else {
    $scope.switchPostType('intention');
  }

  if (!community) {
    $scope.shouldPickCommunity = true;
    $scope.communityOptions = _.map(currentUser.memberships, function(membership) {
      return membership.community;
    });
    community = $scope.community = $scope.communityOptions[0];

    $scope.pickCommunity = function(id) {
      community = $scope.community = _.find($scope.communityOptions, function(x) {
        return x.id == id;
      });
    };
  }


};

module.exports = function(angularModule) {
  angularModule.controller('PostEditCtrl', controller);
};
