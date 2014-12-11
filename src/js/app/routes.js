angular.module('hyloRoutes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/404");

    $stateProvider.
      state("404", {
        url: '/404/',
        templateUrl: '/ui/app/404.tpl.html'
      }).
      state('home', {
        url: '/',
        onEnter: function reloadCtrl() {
          window.location.replace('/');
        }
      }).
      state('community', {
        url: '/c/:community/',
        views: {
          "": {
            templateUrl: '/ui/features/community/base.tpl.html',
            controller: 'CommunityCtrl'
          }
        }
      }).
      state('community.about', {
        url: 'about/',
        views: {
          "tab": {
            templateUrl: '/ui/features/community/about.tpl.html',
            controller: 'AboutCommunityCtrl'
          }
        }
      }).
      state('community.members', {
        url: 'members/',
        views: {
          "tab": {
            templateUrl: '/ui/features/community/members.tpl.html',
            controller: 'CommunityUsersCtrl'
          }
        }
      }).
      state('createCommunity', {
        url: '/create/community/',
        views: {
          "": {
            templateUrl: '/ui/features/community/createCommunity.tpl.html',
            controller: 'CreateCommunityCtrl'
          }
        }
      }).
      state('communitySettings', {
        url: '/c/:community/settings/',
        views: {
          "": {
            templateUrl: '/ui/features/community/settings.tpl.html',
            controller: 'CommunitySettingsCtrl'
          }
        }
      }).
      state('user', {
        url: '/u/:id/',
        views: {
          "": {
            templateUrl: '/ui/app/user.tpl.html',
            controller: 'UserCtrl'
          }
        }
      }).
      state('user.settings', {
        url: 'settings/',
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
        url: '/comments/',
        data: {
          singlePost: true
        }
      }).
      state('search', {
        url: "/c/:community/search/?q",
        views: {
          "": {
            templateUrl: '/ui/app/search.tpl.html',
            controller: 'SearchCtrl'
          }
        }
      }).
      state('network', {
        url: "/n/:network/",
        views: {
          "": {
            templateUrl: '/ui/app/network.tpl.html',
            controller: 'NetworkCtrl'
          }
        }
      });
  }]);
