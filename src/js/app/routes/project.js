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
  .state('editProject', {
    url: '/project/:id/edit',
    parent: 'main',
    resolve: {
      project: /*@ngInject*/ function(Project, $stateParams) {
        return Project.get({id: $stateParams.id}).$promise;
      }
    },
    views: {
      main: {
        templateUrl: '/ui/project/edit.tpl.html',
        controller: 'ProjectEditCtrl'
      }
    }
  })
  .state('project', /*@ngInject*/ {
    url: '/project/:id',
    parent: 'main',
    abstract: true,
    resolve: {
      project: function(Project, $stateParams) {
        return Project.get({id: $stateParams.id}).$promise;
      }
    },
    views: {
      main: {
        templateUrl: '/ui/project/show.tpl.html',
        controller: function($scope, project, currentUser, growl) {
          $scope.project = project;
          $scope.isCreator = currentUser && project.user_id === currentUser.id;

          $scope.details = truncate(project.details || '', 420);
          $scope.truncatedDetails = project.details && $scope.details !== project.details;
          $scope.showFullDetails = function() {
            $scope.details = project.details;
            $scope.truncatedDetails = false;
          };

          $scope.publish = function() {
            project.publish(function(resp) {
              project.published_at = resp.published_at;
              growl.addSuccessMessage('Published! You can unpublish from the Edit Project screen if you change your mind.');
            });
          };

        }
      }
    }
  })
  .state('project.requests', /*@ngInject*/ {
    url: '',
    views: {
      tab: {
        templateUrl: '/ui/project/requests.tpl.html',
        controller: function($scope) {
          $scope.foo = 'i am foo.';
        }
      }
    }
  })
  .state('project.contributors', /*@ngInject*/ {
    url: '/contributors',
    views: {
      tab: {
        template: 'contributors tab placeholder. {{foo}}',
        controller: function($scope) {
          $scope.foo = 'controller stub is working.';
        }
      }
    }
  });

};