angular.module('hyloRoutes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/404");

    $stateProvider.
      state("404", {
        url: '/404',
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
        }
      }).
      state('home', {
        url: '/',
        onEnter: function reloadCtrl() {
          window.location.replace('/');
        }
      }).
      state('community', {
        url: '/c/:community',
        views: {
          "": {
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
        views: {
          "": {
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
      state('main.profile', {
        url: '/u2/:id',
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
      state('main.profile.seeds', {
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
      state('main.profile.contributions', {
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
      state('main.profile.thanks', {
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
        views: {
          "": {
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
        views: {
          "": {
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
