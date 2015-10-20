var steps = {
  start: {
    state: 'onboarding.start',
  },
  seeds: {
    state: 'onboarding.seeds',
  },
  community: {
    state: 'community.posts'
  },
  profile: {
    state: 'profile.about'
  }
};

var sanitize = function(string) {
  if (!string) return;

  return _.chain(string.split(/,|\n/))
    .map(function(x) { return x.trim(); })
    .reject(function(x) { return x === ''; })
    .uniq().value();
};

var stepOrder = ['start', 'community', 'profile', 'done'];

var factory = function($timeout, $resource, $rootScope, $state, $analytics, $modal) {

  var OnboardingResource = $resource('/noo/user/:userId/onboarding', {userId: '@userId'});

  var Onboarding = function(user) {
    // for internal use only
    this._user = user;
    this._status = user.onboarding.status;

    // TESTING
    var params = require('querystring').parse(location.search.replace(/^\?/, ''));
    if (params.obs) {
      _.merge(this._status, {step: params.obs});
      this.allowBack = true;
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      $rootScope.$emit('announcer:hide');

      if (this.currentStep() === 'community' && toState.name === 'profile' && toParams.id === this._user.id) {
        if (this._announcerDelay) {
          $timeout.cancel(this._announcerDelay);
        }
        this.setStep('profile', true);
      }

    }.bind(this));

  };

  _.extend(Onboarding.prototype, {
    init: function() {
      var get = OnboardingResource.get({userId: this._user.id});
      // this is used in templates
      this.community = get;
      return get.$promise;
    },
    trackStep: function(name) {
      return this._track('Step: ' + name);
    },
    currentStep: function() {
      if (!_.contains(stepOrder, this._status.step))
        return 'community';

      return this._status.step;
    },
    showCommunityModal: function() {
      $modal.open({
        templateUrl: '/ui/onboarding/community-modal.tpl.html',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'onboarding-modal',
        controller: function($scope) {
          'ngInject';
          $scope.conversationStep = 1;
        }
      }).result.then(input => {
        this._saveCommunityModalInput(input);

        this._announcerDelay = $timeout(() => $rootScope.$emit('announcer:show', {
          text: "Next, click here to visit your profile.",
          onclick: () => this._goDelta(0),
          className: 'point-to-profile'
        }), 3000);

        this.setStep('profile', true);
      });
    },
    showProfileModal: function() {
      $modal.open({
        templateUrl: '/ui/onboarding/profile-modal.tpl.html',
        windowClass: 'onboarding-modal',
      }).result.then(() => this.setStep('done', true));
    },
    goNext: function() {
      this._goDelta(1);
    },
    goBack: function() {
      this._goDelta(-1);
    },
    jump: function(name) {
      this._go(name, true);
    },
    _goDelta: function(delta) {
      var next = stepOrder[_.indexOf(stepOrder, this.currentStep()) + delta];
      this._go(next, delta !== 0);
    },
    _go: function(name, update) {
      this.setStep(name, update);

      var params;
      if (_.include(['community'], name)) {
        params = {community: this.community.slug};
      } else if (_.include(['profile'], name)) {
        params = {id: this._user.id};
      } else {
        params = {};
      }
      return $state.go(steps[name].state, params);
    },
    setStep: function(name, update) {
      this.trackStep(name);
      this._status.step = name;

      if (update) {
        OnboardingResource.save({userId: this._user.id, step: name});
      }
    },
    _track: function(name, params) {
      $analytics.eventTrack('Onboarding: ' + name, _.merge({
        user_id: this._user.id,
        new_user: this._status.new_user
      }, params));
    },
    _saveCommunityModalInput: function(input) {
      // process responses to prompts
      input = {
        skills: sanitize(input.skills),
        organizations: sanitize(input.organizations)
      };

      // add skills to front-end
      if (_.isEmpty(input.skills)) {
        delete input.skills;
      } else {
        this._track('Add Skills');
        this._user.skills = input.skills;
      }

      // add organizations to front-end
      if (_.isEmpty(input.organizations)) {
        delete input.organizations;
      } else {
        this._track('Add Affiliations');
        this._user.organizations = input.organizations;
      }

      // save data to back-end
      if (!_.isEmpty(input))
        this._user.update(input);
    }
  });

  return Onboarding;
};

module.exports = function(angularModule) {
  angularModule.factory('Onboarding', factory);
};
