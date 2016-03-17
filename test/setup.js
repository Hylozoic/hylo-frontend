window._ = require('lodash');
require('angular');
require('angular-mocks');

window.hyloEnv = {
  isProd: false,
  environment: 'test',
  version: 'test',
  s3: {
    bucket: 'hylo-testing',
    cloudfrontHost: 'hylo-testing.s3.amazonaws.com'
  },
  fb: {appId: 'fakeId'},
  rollbar: {token: 'fakeToken'},
  segment: {key: 'fakeKey'},
  filepicker: {key: 'fakeKey'},
  onUser: function(fn) {
    hyloEnv.onUserCallbacks.push(fn);
  },
  provideUser: function(user) {
    _.each(hyloEnv.onUserCallbacks, function(fn, i) {
      fn.call(user, user);
    });
  },
  onUserCallbacks: []
};

require('../src/js/index');
