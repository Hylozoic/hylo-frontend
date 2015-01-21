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
          // Use the resource to fetch data from the server
          oldCurrentUser: ['CurrentUser', function(CurrentUser) {
            return CurrentUser.get().$promise;
          }],
          // user info has to be fetched from the new API for editing on
          // the new profile. eventually the old CurrentUser will be replaced
          // with this one.
          currentUser: ['User', function(User) {
            return User.current().$promise;
          }]
        },
        controller: ['$rootScope', 'oldCurrentUser', function($rootScope, oldCurrentUser) {
          $rootScope.currentUser = oldCurrentUser;
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
          "main": {
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
      state('newSeed', {
        url: '/c/:community/new-seed',
        views: {
          "": {
            templateUrl: '/ui/seeds/new.tpl.html',
            controller: 'NewSeedCtrl'
          }
        }
      }).
      state('userSettings', {
        url: '/settings',
        parent: 'main',
        views: {
          "main": {
            templateUrl: '/ui/user/settings.tpl.html',
            controller: 'UserSettingsCtrl'
          }
        }
      }).
      state('profile', {
        parent: 'main',
        url: '/u/:id',
        resolve: {
          editable: ['currentUser', '$stateParams', function(currentUser, $stateParams) {
            return parseInt(currentUser.id) == parseInt($stateParams.id);
          }],
          user: ['User', 'editable', '$stateParams', 'currentUser', function(User, editable, $stateParams, currentUser) {
            if (editable) {
              return currentUser;
            } else {
              return User.get({id: $stateParams.id}).$promise;
            }
          }],
          posts: ['user', function(user) {
            return user.seeds().$promise;
          }]
        },
        views: {
          'main': {
            templateUrl: '/ui/profile/base.tpl.html',
            controller: 'ProfileCtrl'
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
        resolve: {
          thanks: ['user', function(user) {
            return user.thanks().$promise;
          }]
        },
        views: {
          'tab': {
            templateUrl: '/ui/profile/thanks.tpl.html',
            controller: 'ProfileThanksCtrl'
          }
        }
      }).
      state('editProfile', {
        url: '/edit-profile',
        parent: 'main',
        views: {
          'main': {
            templateUrl: '/ui/profile/edit.tpl.html',
            controller: 'ProfileEditCtrl'
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
