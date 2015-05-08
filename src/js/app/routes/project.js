var truncate = require('html-truncate');

module.exports = function ($stateProvider) {

  $stateProvider
  .state('newProject', {
    url: '/new-project',
    parent: 'main',
    resolve: {
      project: function() { return null }
    },
    views: {
      main: {
        templateUrl: '/ui/project/edit.tpl.html',
        controller: 'ProjectEditCtrl'
      }
    }
  })
  .state('project', /*@ngInject*/ {
    url: '/project/:slug',
    parent: 'main',
    resolve: {
      project: function(Project, $stateParams) {
        return Project.get({slug: $stateParams.slug}).$promise;
      }
    },
    views: {
      main: {
        templateUrl: '/ui/project/show.tpl.html',
        controller: function($scope, project) {
          $scope.project = project;
          $scope.isCreator = true;
          $scope.selectedTab = 'requests';

          $scope.details = truncate(project.details || '', 420);
          $scope.truncatedDetails = project.details && $scope.details !== project.details;
          $scope.showFullDetails = function() {
            $scope.details = project.details;
            $scope.truncatedDetails = false;
          };
        }
      }
    }
  })
  .state('editProject', {
    url: '/project/:slug/edit',
    parent: 'main',
    resolve: {
      project: /*@ngInject*/ function(Project, $stateParams) {
        return Project.get({slug: $stateParams.slug}).$promise;
      }
    },
    views: {
      main: {
        templateUrl: '/ui/project/edit.tpl.html',
        controller: 'ProjectEditCtrl'
      }
    }
  });

};