module.exports = function ($stateProvider) {

  $stateProvider
  .state('newProject', {
    url: '/h/new-project',
    parent: 'main',
    views: {
      main: {
        templateUrl: '/ui/project/edit.tpl.html',
        controller: /*@ngInject*/ function($scope, currentUser, Project) {

          var project;

          $scope.communities = _.map(currentUser.memberships, function(membership) {
            return membership.community;
          });

          $scope.visibilityOptions = [
            {label: 'Only the community', value: 0},
            {label: 'Anyone', value: 1}
          ];

          $scope.pickedVisibility = function() {
            return _.find($scope.visibilityOptions, function(opt) {
              return project.visibility == opt.value;
            });
          }

          project = $scope.project = {
            community: $scope.communities[0],
            visibility: 0
          };

          $scope.save = function() {
            Project.save(project);
          };

        }
      }
    }
  })
  .state('project', {
  });

};