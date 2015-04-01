module.exports = function ($stateProvider) {
  $stateProvider
  .state('profile', {
    parent: 'main',
    url: '/u/:id',
    resolve: /*@ngInject*/ {
      isSelf: function(currentUser, $stateParams) {
        return parseInt(currentUser.id) === parseInt($stateParams.id);
      },
      user: function(User, isSelf, $stateParams, currentUser) {
        if (isSelf) {
          return currentUser;
        } else {
          return User.get({id: $stateParams.id}).$promise;
        }
      }
    },
    views: {
      'main': {
        templateUrl: '/ui/profile/base.tpl.html',
        controller: 'ProfileCtrl'
      }
    }
  })
  .state('profile.seeds', {
    url: '/seeds',
    resolve: /*@ngInject*/ {
      firstSeedQuery: function(Seed, UserCache, user) {
        return UserCache.fetchSeeds(user.id);
      }
    },
    views: {
      'tab': {
        templateUrl: '/ui/seeds/list.tpl.html',
        controller: 'SeedListCtrl'
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
      'tab': {
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
      'tab': {
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

