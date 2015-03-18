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
      firstSeedQuery: function(Seed, Cache, user) {
        var key = 'profile.seeds:' + user.id,
          cached = Cache.get(key);

        if (cached) {
          return cached;
        } else {
          return Seed.queryForUser({
            userId: user.id,
            limit: 10
          }).$promise.then(function(resp) {
            Cache.set(key, resp, {maxAge: 10 * 60});
            return resp;
          });
        }
      }
    },
    views: {
      'tab': {
        templateUrl: '/ui/profile/seeds.tpl.html',
        controller: 'ProfileSeedsCtrl'
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

