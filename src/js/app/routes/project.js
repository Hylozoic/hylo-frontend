module.exports = function ($stateProvider) {

  $stateProvider
  .state('newProject', {
    url: '/new-project',
    parent: 'main',
    resolve: {
      project: function() {}
    },
    views: {
      main: {
        templateUrl: '/ui/project/edit.tpl.html',
        controller: 'ProjectEditCtrl'
      }
    }
  })
  .state('project', {
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
        controller: /*@ngInject*/ function($scope, project) {
          $scope.project = project;
        }
      }
    }
  })
  .state('editProject', {
    url: '/project/:slug/edit',
    parent: 'main',
    resolve: {
      project: function(Project, $stateParams) {
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