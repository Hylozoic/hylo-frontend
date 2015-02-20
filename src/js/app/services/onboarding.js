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
    state: 'community.seeds.onboarding'
  }
};

var stepOrder = ['start', 'seeds', 'seeds2', 'newSeed', 'community']


var factory = function($resource, $state) {

  var Onboarding = function(data, user) {
    this.resource = $resource('/noo/user/:userId/onboarding', {
    });

    this.data = data;

    // TODO real data
    _.extend(this.data, {
      status: {
        step: 'community'
      },
      community: user.memberships[0].community,
      leader: {
        name: 'Timothy Leary',
        avatar_url: 'http://consciousthinkers.billyojai.com/wp-content/uploads/2013/07/Timothy-Leary.jpg'
      },
      message: 'My advice to people today is as follows: if you take the game of life seriously, '+
        'if you take your nervous system seriously, if you take your sense organs seriously, if you '+
        'take the energy process seriously, you must turn on, tune in, and drop out.'
    })
  };

  _.extend(Onboarding.prototype, {
    isComplete: function() {
      return this.data.status.complete;
    },
    currentState: function() {
      return steps[this.data.status.step].state;
    },
    resume: function() {
      this._go(this.data.status.step);
    },
    goNext: function() {
      this._goDelta(1);
    },
    goBack: function() {
      this._goDelta(-1);
    },
    _goDelta: function(delta) {
      var next = stepOrder[_.indexOf(stepOrder, this.data.status.step) + delta];
      this._go(next);
    },
    _go: function(name) {
      var params;
      if (_.include(['newSeed', 'community'], name)) {
        params = {community: this.data.community.slug};
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