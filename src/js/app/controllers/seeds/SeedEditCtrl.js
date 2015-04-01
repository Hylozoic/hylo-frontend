var filepickerUpload = require('../../services/filepickerUpload'),
  format = require('util').format;

var directive = function($scope, currentUser, community, Seed, growl, $analytics, UserMentions, seed, $state, onboarding, $rootScope, Cache, UserCache) {

  $scope.onboarding = onboarding;

  // onboarding mode is not the same as the presence of the onboarding object --
  // it should not be enabled, e.g., when someone is still in onboarding but is
  // editing the seed they just created or creating a 2nd one
  $scope.onboardingMode = (onboarding && onboarding.currentStep() === 'newSeed');

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

  $scope.switchSeedType = function(seedType) {
  	$scope.seedType = seedType;
    $scope.title = prefixes[seedType] + ' ';
    $scope.descriptionPlaceholder = placeholders[seedType];
  };

  $scope.close = function() {
    $rootScope.seedEditProgress = null;
    $state.go('community.seeds', {community: community.slug});
  };

  $scope.addImage = function() {
    $scope.addingImage = true;

    function finish() {
      $scope.addingImage = false;
      $scope.$apply();
    }

    filepickerUpload({
      path: format('user/%s/seeds', currentUser.id),
      success: function(url) {
        $scope.imageUrl = url;
        $scope.imageRemoved = false;
        finish();
      },
      failure: function(err) {
        finish();
      }
    })
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
    Cache.drop('community.seeds:' + community.id);
    UserCache.clearSeeds(currentUser.id);
  };

  var update = function(data) {
    seed.update(data, function() {
      $analytics.eventTrack('Edit Post', {has_mention: $scope.hasMention, community_name: community.name, community_id: community.id});
      clearCache();
      $state.go('seed', {community: community.slug, seedId: seed.id});
      growl.addSuccessMessage('Seed updated.');
    }, function(err) {
      $scope.saving = false;
      growl.addErrorMessage(err.data);
      $analytics.eventTrack('Edit Post Failed');
    });
  };

  var create = function(data) {
    new Seed(data).$save(function() {
      $analytics.eventTrack('Add Post', {has_mention: $scope.hasMention, community_name: community.name, community_id: community.id});
      clearCache();
      if ($scope.onboardingMode) {
        onboarding.markSeedCreated(data.type);
      } else {
        $scope.close();
        growl.addSuccessMessage('Seed created!');
      }
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
      type: $scope.seedType,
      communityId: community.id,
      imageUrl: $scope.imageUrl,
      imageRemoved: $scope.imageRemoved
    };
    $scope.editing ? update(data) : create(data);
  };

  $scope.searchPeople = function(query) {
    UserMentions.searchPeople(query, community).$promise.then(function(items) {
      $scope.people = items;
    });
  };

  $scope.getPeopleTextRaw = function(user) {
    $analytics.eventTrack('Post: Add New: @-mention: Lookup', {query: user.name} );
    $scope.hasMention = true;
    return UserMentions.userTextRaw(user);
  };

  $scope.storeProgress = function() {
    $rootScope.seedEditProgress = {
      title: $scope.title,
      description: $scope.description,
      type: $scope.seedType
    };
  };

  if (seed) {
    $scope.editing = true;
    $scope.switchSeedType(seed.type);
    $scope.title = seed.name;
    if (seed.media[0]) {
      $scope.imageUrl = seed.media[0].url;
    }

    if (seed.description.substring(0, 3) === '<p>') {
      $scope.description = seed.description;
    } else {
      $scope.description = format('<p>%s</p>', seed.description);
    }
  } else if ($rootScope.seedEditProgress) {
    $scope.switchSeedType($rootScope.seedEditProgress.type);
    $scope.title = $rootScope.seedEditProgress.title;
    $scope.description = $rootScope.seedEditProgress.description;

  } else {
    var defaultType = (onboarding ? 'offer' : 'intention');
    $scope.switchSeedType(defaultType);
  }

};

module.exports = function(angularModule) {
  angularModule.controller('SeedEditCtrl', directive);
}