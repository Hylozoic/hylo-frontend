angular.module('hyloRoutes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise(function(injector, location) {
      if (!hyloEnv.isProd) {
        console.error("ERROR 404|Angular Routes", location)
      } else {
        window.location.replace(jsRoutes.controllers.Application.show404(location.path()).absoluteURL());
      }
    });

    $stateProvider.
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
            templateUrl: '/ui/app/community.tpl.html',
            controller: 'CommunityCtrl'
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
      state('editCommunity', {
        url: '/edit/community/:id',
        views: {
          "": {
            templateUrl: '/ui/features/community/editCommunity.tpl.html',
            controller: 'EditCommunityCtrl'
          }
        }
      }).
      state('members', {
        url: '/c/:community/members',
        views: {
          "": {
            templateUrl: '/ui/app/community_users.tpl.html',
            controller: 'CommunityUsersCtrl'
          }
        }
      }).
      state('user', {
        url: '/c/:community/user/:id',
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
      });
  }]);
