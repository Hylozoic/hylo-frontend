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
    resolve: {
      requests: function(Seed, project) {
        return Seed.queryForProject({projectId: project.id}).$promise;
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/project/requests.tpl.html',
        controller: function($scope, project, Seed, growl, Cache, UserCache, $analytics, requests, currentUser) {

          $scope.posts = requests;
          var newRequest = $scope.newRequest = {};

          $scope.addRequest = function() {
            new Seed({
              name: newRequest.name,
              projectId: project.id,
              communityId: project.community.id,
              type: 'request'
            }).$save(function() {
              $analytics.eventTrack('Add Post', {
                has_mention: $scope.hasMention,
                community_name: project.community.name,
                community_id: project.community.id,
                project_id: project.id
              });

              // FIXME this is copied from SeedEditCtrl
              Cache.drop('community.seeds:' + project.community.id);
              UserCache.seeds.clear(currentUser.id);
              UserCache.allSeeds.clear(currentUser.id);

              $scope.posts = Seed.queryForProject({projectId: project.id});
              newRequest.name = null;

            }, function(err) {
              growl.addErrorMessage(err.data);
              $analytics.eventTrack('Add Post Failed');
            });

          };

          $scope.removePost = function(post) {
            growl.addSuccessMessage("Post has been removed: " + post.name, {ttl: 5000});
            $analytics.eventTrack('Post: Remove', {post_name: post.name, post_id: post.id});
            $scope.posts.splice($scope.posts.indexOf(post), 1);
          };

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