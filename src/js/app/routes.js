angular.module('hyloRoutes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/404");

    $stateProvider.
      state("404", {
        url: '/404',
        templateUrl: '/ui/app/404.tpl.html'
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
            templateUrl: '/ui/app/community.tpl.html',
            controller: 'CommunityCtrl'
          }
        }
      }).
      state('community.seeds', {
        url: '/seeds',
        views: {
          "communityContentView": {
            templateUrl: '/ui/app/community_list.tpl.html',
            controller: function($scope) {
              $scope.items = ['Seed1', 'Seed2', 'Seed3'];
            }
          }
        }
      }).
      state('community.about', {
        url: '/about',
        views: {
          "communityContentView": {
            templateUrl: '/ui/features/community/aboutCommunity.tpl.html',
            controller: function($scope) {
              $scope.intention = "Community Intention to go here";
            }
          }
        }
      }).
      state('community.members', {
        url: '/members',
        views: {
          "communityContentView": {
            templateUrl: '/ui/features/community/communityMembers.tpl.html',
            controller: function($scope) {
              $scope.list = "list of members to go here";
            }
          }
        }
      }).
      state('community.list', {
        url: '/list',
        views: {
          "listA": {
            templateUrl: '/ui/app/community_list.tpl.html',
            controller: function($scope) {
              $scope.items = ['A', 'B', 'C'];
            }
          },
          "listB": {
            templateUrl: '/ui/app/community_list.tpl.html',
            controller: function($scope) {
              $scope.items = ['1', '2', '3'];
            }
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
      state('members', {
        url: '/c/:community/members',
        views: {
          "": {
            templateUrl: '/ui/app/members.tpl.html',
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
