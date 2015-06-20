var filepickerUpload = require('../../services/filepickerUpload');

var controller = function($scope, currentUser, Project, project) {

  $scope.communities = _.map(currentUser.memberships, function(membership) {
    return membership.community;
  });

  if (!project) {
    project = {
      community: $scope.communities[0],
      visibility: 0
    };
  } else {
    project.community = _.find($scope.communities, function(c) { return c.id == project.community_id });
  }

  $scope.project = project;

  $scope.visibilityOptions = [
    {label: 'Only the community', value: 0},
    {label: 'Anyone', value: 1}
  ];

  $scope.pickedVisibility = function() {
    return _.find($scope.visibilityOptions, function(opt) {
      return project.visibility == opt.value;
    });
  };

  $scope.save = function() {
    var attrs = _.merge({}, _.omit(project, 'community'), {
      community_id: project.community.id
    });
    Project.save(attrs, function(project) {
      $scope.$state.go('project.posts', {id: project.slug});
    });
  };

  $scope.addImage = function() {
    if ($scope.addingImage) return;
    $scope.addingImage = true;

    var finish = function() {
      $scope.addingImage = false;
      $scope.$apply();
    };

    filepickerUpload({
      path: format('user/%s/projects', currentUser.id),
      success: function(url) {
        project.image_url = url;
        finish();
      },
      failure: finish
    });
  };

  $scope.removeImage = function() {
    project.image_url = null;
  };

  $scope.unpublish = function() {
    project.unpublish(function() {
      project.published_at = null;
      $scope.$state.go('project.posts', {id: project.slug});
    })
  };

};

module.exports = function(angularModule) {
  angularModule.controller('ProjectEditCtrl', controller);
};