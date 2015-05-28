var RichText = require('../../services/RichText');

module.exports = function($scope, $state, $anchorScroll, project, currentUser, growl, $stateParams) {
  "ngInject";

  $scope.project = project;
  $scope.isCreator = $scope.canModerate = currentUser && project.user_id === currentUser.id;
  $scope.isContributor = project.is_contributor;

  $scope.details = RichText.present(project.details, {maxlength: 420});
  $scope.truncatedDetails = project.details && project.details.length > 420;

  $scope.showFullDetails = function() {
    $scope.details = RichText.present(project.details);
    $scope.truncatedDetails = false;
  };

  $scope.publish = function() {
    project.publish(function(resp) {
      project.published_at = resp.published_at;
      growl.addSuccessMessage('Published! You can unpublish from the Edit Project screen if you change your mind.');
    });
  };

  $scope.goToTab = function(name) {
    if ($state.current.name === 'project.' + name) {
      $anchorScroll('tabs');
    } else {
      $state.go('project.' + name, {id: project.slug, '#': 'tabs'});
    }
  };

  $scope.join = function() {
    // TODO show login prompt if not logged in

    project.join({token: $stateParams.token}, function() {
      $scope.isContributor = true;
      $scope.$broadcast('joinProject');
    })
  };

}