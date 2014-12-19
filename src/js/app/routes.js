angular.module('hyloRoutes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise(function($injector, $location){
      var state = $injector.get('$state');
      Rollbar.warning("404 Error: " + $location.path());
      state.go('404');
      return $location.path();
    });

    $stateProvider.
      state("404", {
        templateUrl: '/ui/app/404.tpl.html'
      }).
      state('main', {
        abstract: true,
        template: "<div ui-view='main'></div>",
        resolve: {
          // Get AngularJS CurrentUser resource to query
          CurrentUser: 'CurrentUser',

          // Use the resource to fetch data from the server
          currentUser: ['CurrentUser', function(CurrentUser) {
            return CurrentUser.get().$promise;
          }]
        },
        controller: ['$rootScope', 'currentUser', function($rootScope, currentUser) {
          // Set the currentUser into rootScope to be used in templates across the app
          $rootScope.currentUser = currentUser;
        }]
      }).
      state('home', {
        url: '/',
        // redirects to hylo-play which resolves the URL to a community.
        onEnter: function reloadCtrl() {
          window.location.replace('/');
        }
      }).
      state('community', {
        url: '/c/:community',
        parent: "main",
        views: {
          "main": {
            templateUrl: '/ui/features/community/base.tpl.html',
            controller: 'CommunityCtrl'
          }
        }
      }).
      state('community.about', {
        url: '/about',
        views: {
          "tab": {
            templateUrl: '/ui/features/community/about.tpl.html',
            controller: 'AboutCommunityCtrl'
          }
        }
      }).
      state('community.members', {
        url: '/members',
        views: {
          "tab": {
            templateUrl: '/ui/features/community/members.tpl.html',
            controller: 'CommunityUsersCtrl'
          }
        }
      }).
      state('createCommunity', {
        url: '/create/community',
        parent: 'main',
        views: {
          "": {
            templateUrl: '/ui/features/community/createCommunity.tpl.html',
            controller: 'CreateCommunityCtrl'
          }
        }
      }).
      state('communitySettings', {
        url: '/c/:community/settings',
        views: {
          "": {
            templateUrl: '/ui/features/community/settings.tpl.html',
            controller: 'CommunitySettingsCtrl'
          }
        }
      }).
      state('user', {
        url: '/u/:id',
        parent: 'main',
        views: {
          "main": {
            templateUrl: '/ui/app/user.tpl.html',
            controller: 'UserCtrl'
          }
        }
      }).
      state('user.settings', {
        url: '/settings',
        template: "",
        controller: 'ProfileSettingsCtrl'
      }).
      state('profile', {
        url: '/u2/:id',
        parent: 'main',
        abstract: true,
        resolve: {
          editable: ['currentUser', '$stateParams', function(currentUser, $stateParams) {
            return currentUser.id === $stateParams.id;
          }],
          User: 'User',
          user: ['User', 'editable', '$stateParams', function(User, editable, $stateParams) {
            if (editable) {
              return User.current().$promise;
            } else {
              return User.get({id: $stateParams.id}).$promise;
            }
          }]
        },
        views: {
          'main': {
            templateUrl: '/ui/profile/base.tpl.html',
            controller: 'ProfileCtrl'
          }
        }
      }).
      state('profile.seeds', {
        url: '',
        resolve: {
          seeds: ['user', function(user) {
            //return user.seeds().$promise;
          }]
        },
        views: {
          'tab': {
            templateUrl: '/ui/profile/seeds.tpl.html'
            //controller: 'ProfileContributionsCtrl'
          }
        }
      }).
      state('profile.contributions', {
        url: '/contributions',
        resolve: {
          contributions: ['user', function(user) {
            return user.contributions().$promise;
          }]
        },
        views: {
          'tab': {
            templateUrl: '/ui/profile/contributions.tpl.html',
            controller: 'ProfileContributionsCtrl'
          }
        }
      }).
      state('profile.thanks', {
        url: '/thanks',
        views: {
          'tab': {
            templateUrl: '/ui/profile/thanks.tpl.html',
            controller: 'ProfileThanksCtrl'
          }
        }
      }).
      state('post', {
        url: '/c/:community/s/:postId',
        parent: 'main',
        views: {
          "main": {
            templateUrl: '/ui/app/view_post.tpl.html',
            controller: 'ViewPostCtrl'
          }
        }
      }).
      state('post.comments', {
        url: '/comments',
        data: {
          singlePost: true
        }
      }).
      state('search', {
        url: "/c/:community/search?q",
        parent: 'main',
        views: {
          "main": {
            templateUrl: '/ui/app/search.tpl.html',
            controller: 'SearchCtrl'
          }
        }
      }).
      state('network', {
        url: "/n/:network",
        views: {
          "": {
            templateUrl: '/ui/app/network.tpl.html',
            controller: 'NetworkCtrl'
          }
        }
      });
  }]);
