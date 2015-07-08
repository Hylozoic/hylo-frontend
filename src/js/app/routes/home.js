module.exports = function ($stateProvider) {

  $stateProvider
  .state('home', {
    abstract: true,
    parent: 'main',
    resolve: {
      requireLogin: /*@ngInject*/ function(User, currentUser) {
        return User.requireLogin(currentUser);
      }
    },
    data: {
      showTabs: true
    },
    views: {
      main: {
        templateUrl: '/ui/home/show.tpl.html',
        controller: function() {}
      }
    }
  })
  .state('home.simple', /*@ngInject*/ {
    url: '/h/starting-out',
    resolve: {
      projects: function(currentUser, requireLogin) {
        return currentUser.projects().$promise;
      }
    },
    data: {
      showTabs: false
    },
    views: {
      tab: {
        templateUrl: '/ui/home/simple.tpl.html',
        controller: function($scope, projects, currentUser, $http) {
          'ngInject';
          $scope.projects = projects;

          $scope.submit = function(form) {
            form.submitted = true;
            if (form.$invalid) return;

            $http({
              method: 'POST',
              url: '/noo/waitlist',
              data: {
                name: currentUser.name,
                email: currentUser.email,
                details: $scope.details
              }
            }).success(function() {
              $scope.success = "Thank you for contacting us! We'll get back to you soon.";
            });
          };

        }
      }
    }
  })
  .state('home.myPosts', {
    url: '/h/my-posts',
    resolve: /*@ngInject*/{
      firstPostQuery: function(UserCache, currentUser, requireLogin) {
        return UserCache.posts.fetch(currentUser.id);
      },
      user: function(currentUser) {
        return currentUser;
      },
      isSelf: function() { return true }
    },
    views: {
      tab: {
        templateUrl: '/ui/home/my-posts.tpl.html',
        controller: 'PostListCtrl'
      }
    }
  })
  .state('home.following', {
    url: '/h/following',
    resolve: /*@ngInject*/{
      firstPostQuery: function(UserCache, currentUser, requireLogin) {
        return UserCache.followedPosts.fetch(currentUser);
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/home/following-posts.tpl.html',
        controller: 'FollowedPostsCtrl'
      }
    }
  })
  .state('home.allPosts', {
    url: '/h/all-posts',
    resolve: /*@ngInject*/{
      firstPostQuery: function(UserCache, currentUser, requireLogin) {
        return UserCache.allPosts.fetch(currentUser);
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/home/all-posts.tpl.html',
        controller: 'AllPostsCtrl'
      }
    }
  })
  .state('home.projects', /*@ngInject*/ {
    url: '/h/my-projects',
    resolve: {
      projects: function(currentUser, requireLogin) {
        return currentUser.projects().$promise;
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/home/projects.tpl.html',
        controller: function($scope, projects) {
          $scope.projects = projects;
        }
      }
    }
  });

};
