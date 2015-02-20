var filepickerUpload = require('../services/filepickerUpload'),
  format = require('util').format;

var directive = function($scope, currentUser, community, Seed, growl, $analytics, UserMentions, seed, $state, onboarding) {

  $scope.onboarding = onboarding;

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
  }

  var update = function(data) {
    seed.update(data, function() {
      $analytics.eventTrack('Edit Post', {has_mention: $scope.hasMention});
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
      $analytics.eventTrack('Add Post', {has_mention: $scope.hasMention});
      onboarding ? onboarding.goNext() : $scope.close();
      growl.addSuccessMessage('Seed created!');
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
    UserMentions.searchPeople(query, community).then(function(people) {
      $scope.people = people;
    });
  };

  $scope.getPeopleTextRaw = function(user) {
    $analytics.eventTrack('Post: Add New: @-mention: Lookup', {query: user.name} );
    $scope.hasMention = true;
    return UserMentions.userTextRaw(user);
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
  } else {
    var defaultType = (onboarding ? 'offer' : 'intention');
    $scope.switchSeedType(defaultType);
  }

};

module.exports = function(angularModule) {
  angularModule.controller('SeedEditCtrl', directive);
}