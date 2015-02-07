var filepickerUpload = require('../services/filepickerUpload'),
  format = require('util').format;

var dependencies = ['$scope', 'currentUser', 'community', 'Seed', 'growl', '$analytics', 'UserMentions', 'seed', '$state'];
dependencies.push(function($scope, currentUser, community, Seed, growl, $analytics, UserMentions, seed, $state) {

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
    $scope.$state.go('community.seeds', {community: community.slug});
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
        finish();
      },
      failure: function(err) {
        finish();
      }
    })
  };

  $scope.removeImage = function() {
    delete $scope.imageUrl;
  };

  var validate = function() {
    var invalidTitle = _.contains(_.values(prefixes), $scope.title.trim());

    // TODO show errors in UI
    if (invalidTitle) alert('Please fill in a title');

    return !invalidTitle;
  }

  var update = function() {
    seed.update({
      name: $scope.title,
      description: $scope.description,
      type: $scope.seedType,
      communityId: community.id,
    }, function() {
      $analytics.eventTrack('Edit Post', {has_mention: $scope.hasMention});
      $state.go('seed', {community: community.slug, seedId: seed.id});
      growl.addSuccessMessage('Seed updated.');
    }, function(err) {
      $scope.saving = false;
      growl.addErrorMessage(err.data);
      $analytics.eventTrack('Edit Post Failed');
    });
  };

  var create = function() {
    var newSeed = new Seed({
      name: $scope.title,
      description: $scope.description,
      type: $scope.seedType,
      communityId: community.id,
      imageUrl: $scope.imageUrl
    });

    newSeed.$save(function() {
      $analytics.eventTrack('Add Post', {has_mention: $scope.hasMention});
      $scope.close();
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
    $scope.editing ? update() : create();
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

    if (seed.description.substring(0, 3) === '<p>') {
      $scope.description = seed.description;
    } else {
      $scope.description = format('<p>%s</p>', seed.description);
    }
  } else {
    $scope.switchSeedType('intention');
  }

});

module.exports = function(angularModule) {
  angularModule.controller('SeedEditCtrl', dependencies);
}