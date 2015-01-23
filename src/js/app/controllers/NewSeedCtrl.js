var filepickerUpload = require('../services/filepickerUpload'),
  format = require('util').format;

var dependencies = ['$scope', 'currentUser', 'community', 'Seed', 'growl', '$analytics'];
dependencies.push(function($scope, currentUser, community, Seed, growl, $analytics) {

  var prefixes = {
    intention: "I'd like to create",
    offer: "I'd like to share",
    request: "I'm looking for"
  };

  $scope.switchSeedType = function(seedType) {
  	$scope.seedType = seedType;
    $scope.title = prefixes[seedType] + ' ';
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

});

module.exports = function(angularModule) {
  angularModule.controller('NewSeedCtrl', dependencies);
}