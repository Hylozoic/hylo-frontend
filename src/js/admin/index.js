require('angular-resource');

var app = angular.module('hyloAdmin', ['ngResource']);

require('../app/services/Community')(app);
require('../app/services/Project')(app);

app.factory('Admin', require('./services/Admin'));

app.controller('BaseCtrl', function($scope, Community, Admin) {
  Community.query().$promise.then(function(communities) {
    $scope.communities = _.sortBy(communities, function(c) { return c.slug });
  });

  Admin.get().$promise.then(function(user) {
    $scope.currentUser = user;
  })
});

angular.element(document).ready(function() {
  angular.bootstrap(document.body, ['hyloAdmin'], {strictDi: true});
});
