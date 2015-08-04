var ctrlFn = require('../../src/js/app/controllers/community/CommunityCtrl');

describe('CommunityCtrl', function() {
  var scope, community, $controller;

  beforeEach(function() {
    var mod = angular.module('test', []);
    ctrlFn(mod);

    angular.mock.module('test');

    angular.mock.inject(function($rootScope, _$controller_) {
      scope = $rootScope.$new();
      $controller = _$controller_;
      community = {id: 1, name: 'hello', slug: 'hello'};
    });
  });

  it('sets the community in its scope', function() {
    var ctrl = $controller('CommunityCtrl', {
      $scope: scope,
      $analytics: {eventTrack: function() {}},
      community: community,
      currentUser: null
    });
    expect(scope.community).to.equal(community);
  });

  it('sets canModerate', function() {
    var ctrl = $controller('CommunityCtrl', {
      $scope: scope,
      $analytics: {eventTrack: function() {}},
      community: community,
      currentUser: {canModerate: function() { return true; }}
    });
    expect(scope.canModerate).to.be.true;
  });

});
