var format = require('util').format;

var steps = {
  start: {
    state: 'onboarding.start',
  },
  seeds: {
    state: 'onboarding.seeds',
  },
  seeds2: {
    state: 'onboarding.seeds2'
  },
  newSeed: {
    state: 'community.newSeed'
  },
  community: {
    state: 'community.seeds'
  },
  profile: {
    state: 'profile'
  },
  profileSaved: {
    state: 'profile'
  }
};

var stepOrder = ['start', 'seeds', 'seeds2', 'newSeed', 'community', 'profile', 'profileSaved', 'done'];

var factory = function($timeout, $rootScope, $resource, $state) {

  var OnboardingResource = $resource('/noo/user/:userId/onboarding', {userId: '@userId'});

  var Onboarding = function(user) {
    // this is used in templates
    this.community = user.memberships[0].community;

    // for internal use only
    this._user = user;
    this._status = user.onboarding.status;

    // TESTING
    var params = require('querystring').parse(location.search.replace(/^\?/, ''));
    if (params.obs) {
      _.merge(this._status, {step: params.obs});
    }
  };

  _.extend(Onboarding.prototype, {
    isComplete: function() {
      return this._status.step === 'done';
    },
    canSkipSeedForm: function() {
      return !!this._status.can_skip_seed_form;
    },
    currentStep: function() {
      return this._status.step;
    },
    showOverlay: function(name) {
      $rootScope.$emit('overlay:load', {
        overlay: 'onboarding.' + name,
        onboarding: this,
        hideOverlay: false
      });
    },
    continue: function() {
      var self = this;

      switch (this.currentStep()) {
        case 'community':
          $timeout(function() {
            $rootScope.$emit('announce', {
              text: "When you're ready, click here to visit your profile.",
              onclick: function() {
                self.goNext();
              }
            });
          }, 10000);
          break;

        case 'profileSaved':
          this._status.step = 'done';
          break;
      }
    },
    resume: function() {
      if (this.currentStep() === 'done')
        return;

      // TODO maybe only do this if within the first few steps?
      // i.e. once we get to community step, we can allow open-ended
      // exploration and only continue onboarding through non-modal prompts
      if ($state.$current.name !== steps[this.currentStep()].state)
        this._goDelta(0);
    },
    goNext: function() {
      this._goDelta(1);
    },
    goBack: function() {
      this._goDelta(-1);
    },
    _goDelta: function(delta) {
      var next = stepOrder[_.indexOf(stepOrder, this.currentStep()) + delta];
      this._go(next, delta != 0);
    },
    _go: function(name, update) {
      this._status.step = name;

      if (update) {
        OnboardingResource.save({userId: this._user.id, step: name});
      }

      var params;
      // FIXME code smell
      if (_.include(['newSeed', 'community'], name)) {
        params = {community: this.community.slug};
      } else if (_.include(['profile', 'profileSaved'], name)) {
        params = {id: this._user.id};
      } else {
        params = {};
      }
      return $state.go(steps[name].state, params);
    }
  });

  return Onboarding;
};

module.exports = function(angularModule) {
  angularModule.factory('Onboarding', factory);
};