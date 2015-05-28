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
    url: '/project/:id?token',
    parent: 'main',
    abstract: true,
    resolve: /*@ngInject*/ {
      project: function(Project, $stateParams) {
        return Project.get({id: $stateParams.id, token: $stateParams.token}).$promise;
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
        controller: 'ProjectCtrl'
      }
    }
  })
  .state('project.requests', {
    url: '',
    parent: 'project.page',
    resolve: {
      postQuery: /*@ngInject*/ function(project, $stateParams) {
        return project.posts({token: $stateParams.token, limit: 10}).$promise;
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/project/posts.tpl.html',
        controller: 'ProjectPostsCtrl'
      }
    }
  })
  .state('project.contributors', {
    url: '/contributors',
    parent: 'project.page',
    resolve: {
      users: /*@ngInject*/ function(project, $stateParams) {
        return project.users({token: $stateParams.token, limit: 20}).$promise;
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/project/users.tpl.html',
        controller: 'ProjectUsersCtrl'
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