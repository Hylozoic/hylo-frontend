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

  var Onboarding = function(data, user) {
    this.resource = $resource('/noo/user/:userId/onboarding', {});
    this.data = data;
    this.user = user;

    // TODO real data
    _.extend(this.data, {
      status: {
        step: 'profile'
      },
      community: user.memberships[0].community,
      leader: {
        name: 'Timothy Leary',
        avatar_url: 'http://consciousthinkers.billyojai.com/wp-content/uploads/2013/07/Timothy-Leary.jpg'
      },
      message: 'My advice to people today is as follows: if you take the game of life seriously, '+
        'if you take your nervous system seriously, if you take your sense organs seriously, if you '+
        'take the energy process seriously, you must turn on, tune in, and drop out.'
    });

  };

  _.extend(Onboarding.prototype, {
    isComplete: function() {
      return this.data.status.step === 'done';
    },
    currentStep: function() {
      return this.data.status.step;
    },
    currentState: function() {
      return steps[this.currentStep()].state;
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
          this.data.status.step = 'done';
          break;
      }
    },
    resume: function() {
      if (this.currentStep() === 'done')
        return;

      // TODO maybe only do this if within the first few steps?
      // i.e. once we get to community step, we can allow open-ended
      // exploration and only continue onboarding through non-modal prompts
      if ($state.$current.name !== this.currentState())
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
      this._go(next);
    },
    _go: function(name) {
      var params;
      // FIXME code smell
      if (_.include(['newSeed', 'community'], name)) {
        params = {community: this.data.community.slug};
      } else if (_.include(['profile', 'profileSaved'], name)) {
        params = {id: this.user.id};
      } else {
        params = {};
      }
      this.data.status.step = name;
      return $state.go(steps[name].state, params);
    }
  });

  return Onboarding;
};

module.exports = function(angularModule) {
  angularModule.factory('Onboarding', factory);
};