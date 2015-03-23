describe('app', function() {

  beforeEach(angular.mock.module('hyloApp'));

  beforeEach(angular.mock.inject(function($injector) {
    var $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/noo/user/me').respond({
      id: '42'
    });
  }));

  beforeEach(function() {
    angular.bootstrap(document.body, ['hyloApp'], {strictDi: true});
  });

  it('loads', function() {
    expect(angular.element(document.body).scope()).to.exist;
  });

});
