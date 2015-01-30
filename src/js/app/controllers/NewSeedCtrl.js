var filepickerUpload = require('../services/filepickerUpload'),
  format = require('util').format;

var dependencies = ['$scope', 'currentUser', 'community', 'Seed', 'growl', '$analytics', 'UserMentions'];
dependencies.push(function($scope, currentUser, community, Seed, growl, $analytics, UserMentions) {

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

  $scope.switchSeedType('intention');

  $scope.close = function() {
    $scope.$state.go('community', {community: community.slug});
  };

  $scope.addImage = function() {
    $scope.addingImage = true;
    filepickerUpload({
      path: format('user/%s/seeds', currentUser.id),
      success: function(url) {
        $scope.addingImage = false;
        $scope.imageUrl = url;
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

  $scope.save = function() {
    if (!validate()) return;

    $scope.saving = true;

    var seed = new Seed({
      name: $scope.title,
      description: $scope.description,
      postType: $scope.seedType,
      communityId: community.id,
      imageUrl: $scope.imageUrl
    });

    seed.$save(function() {
      $analytics.eventTrack('Add Post');
      $scope.close();
      growl.addSuccessMessage('Seed created!');
    }, function(err) {
      $scope.saving = false;
      growl.addErrorMessage(err.data);
    });
  };

  $scope.searchPeople = function(query) {
    UserMentions.searchPeople(query, community).then(function(people) {
      $scope.people = people;
    });
  };

  $scope.getPeopleTextRaw = UserMentions.userTextRaw;

});

module.exports = function(angularModule) {
  angularModule.controller('NewSeedCtrl', dependencies);
}