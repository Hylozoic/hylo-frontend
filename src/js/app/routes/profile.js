module.exports = function ($stateProvider) {
  $stateProvider
  .state('profile', {
    parent: 'main',
    url: '/u/:id',
    abstract: true,
    resolve: /*@ngInject*/ {
      isSelf: function(currentUser, $stateParams) {
        return currentUser && currentUser.id === $stateParams.id;
      },
      user: function(User, isSelf, $stateParams, currentUser) {
        if (isSelf) {
          return currentUser;
        } else {
          return User.get({id: $stateParams.id}).$promise;
        }
      },
      showOverlay: function(isSelf, onboarding) {
        // hack -- this is only here so it shows before the controller's other content appears
        if (isSelf && onboarding && onboarding.currentStep() === 'profile') {
          onboarding.showOverlay('profile');
        }
      }
    },
    views: {
      main: {
        templateUrl: '/ui/profile/base.tpl.html',
        controller: 'ProfileCtrl'
      }
    }
  })
  .state('profile.about', {
    url: '/about',
    views: {
      tab: {
        templateUrl: '/ui/profile/about.tpl.html',
        controller: function() {}
      }
    }
  })
  .state('profile.posts', {
    url: '',
    resolve: /*@ngInject*/ {
      firstPostQuery: function(Post, UserCache, user) {
        return UserCache.posts.fetch(user.id);
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/post/list.tpl.html',
        controller: 'PostListCtrl'
      }
    }
  })
  .state('profile.contributions', {
    url: '/contributions',
    resolve: {
      contributions: ['user', function(user) {
        return user.contributions().$promise;
      }]
    },
    views: {
      tab: {
        templateUrl: '/ui/profile/contributions.tpl.html',
        controller: 'ProfileContributionsCtrl'
      }
    }
  })
  .state('profile.thanks', {
    url: '/thanks',
    resolve: {
      thanks: ['user', function(user) {
        return user.thanks().$promise;
      }]
    },
    views: {
      tab: {
        templateUrl: '/ui/profile/thanks.tpl.html',
        controller: 'ProfileThanksCtrl'
      }
    }
  })
  .state('editProfile', {
    url: '/edit-profile',
    parent: 'main',
    views: {
      'main': {
        templateUrl: '/ui/profile/edit.tpl.html',
        controller: 'ProfileEditCtrl'
      }
    }
  });
};

