var routesFn = require('../../src/js/app/routes');
var onboarding

describe('routes', function() {

  var $rootScope, $state, $injector, $q;

  describe('for a community', function() {

    var community, deferred;

    beforeEach(function() {

      community = {id: 1, name: 'hello', slug: 'hello'};

      var mod = angular.module('test', ['ui.router']);
      mod.config(function($locationProvider) {
        $locationProvider.html5Mode(true);
      });

      routesFn(mod);
      angular.mock.module('test', function($provide) {
        $provide.value('Community', {
          get: function() {
            deferred = $q.defer();
            return {$promise: deferred.promise};
          }
        });

        $provide.value('CurrentUser', {
          load: function() {}
        });

        $provide.value('Onboarding', function() {});
      });

      inject(function(_$rootScope_, _$state_, _$injector_, $templateCache, _$q_) {
        $rootScope = _$rootScope_;
        $state = _$state_;
        $injector = _$injector_;
        $q = _$q_;

        $templateCache.put('/ui/shared/main.tpl.html', '');
        $templateCache.put('/ui/community/base.tpl.html', '');
        $templateCache.put('/ui/community/about.tpl.html', '');
      });
    });

    it('matches a community', function() {
      expect($state.href('community.about', {community: 'foo'})).to.equal('/c/foo/about');
    });

    it('resolves the community object', function() {
      $state.go('community.about', {community: 'foo'});
      deferred.resolve(community);
      $rootScope.$apply();
      expect($state.$current.name).to.equal('community.about');

      // Call invoke to inject dependencies and run function
      var promise = $injector.invoke($state.$current.parent.parent.resolve.community);
      expect(promise).to.equal(deferred.promise);
    });
  });

});
