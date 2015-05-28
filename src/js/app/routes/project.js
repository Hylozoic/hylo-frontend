var RichText = require('../services/RichText');

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
  .state('project', {
    url: '/project/:id',
    parent: 'main',
    abstract: true,
    resolve: {
      project: /*@ngInject*/ function(Project, $stateParams) {
        return Project.get({id: $stateParams.id}).$promise;
      }
    },
    views: {
      main: {
        template: '<div ui-view="project"></div>'
      }
    }
  })
  .state('project.page', {
    abstract: true,
    views: {
      project: {
        templateUrl: '/ui/project/show.tpl.html',
        controller: function($scope, $state, $anchorScroll, project, currentUser, growl) {
          "ngInject";

          $scope.project = project;
          $scope.isCreator = currentUser && project.user_id === currentUser.id;

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
        }
      }
    }
  })
  .state('project.requests', {
    url: '',
    parent: 'project.page',
    resolve: {
      postQuery: /*@ngInject*/ function(project) {
        return project.posts({limit: 10}).$promise;
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/project/requests.tpl.html',
        controller: 'ProjectRequestsCtrl'
      }
    }
  })
  .state('project.contributors', /*@ngInject*/ {
    url: '/contributors',
    parent: 'project.page',
    resolve: {
      users: function(project) {
        return project.users({limit: 20}).$promise;
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/project/contributors.tpl.html',
        controller: function($scope, project, users) {
          $scope.users = users;

          $scope.loadMore = _.debounce(function() {
            if ($scope.loadMoreDisabled) return;
            $scope.loadMoreDisabled = true;

            project.users({
              limit: 20,
              offset: $scope.users.length
            }, function(users) {
              Array.prototype.push.apply($scope.users, users);

              if (users.length > 0 && $scope.users.length < users[0].total)
                $scope.loadMoreDisabled = false;
            });

          }, 200);

        }
      }
    }
  })
  .state('project.invite', {
    url: '/invite',
    views: {
      project: {
        templateUrl: '/ui/project/invite.tpl.html',
        controller: 'ProjectInviteCtrl'
      }
    }
  });

};