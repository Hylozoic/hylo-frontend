require('angular-ui-router');
require('angular-resource');

var app = angular.module('hyloAdmin', ['ngResource', 'ui.router']),
  Chart = require('./services/Chart');

require('../app/services/Community')(app);
require('../app/services/Project')(app);

app.factory('Admin', require('./services/Admin'));

app.directive('chart', function() {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    replace: true,
    template: '<div><svg></svg></div>',
    link: function(scope, element, attrs) {
      element.addClass('chart');
      Chart.render({
        data: scope.data,
        to: element.find('svg')[0]
      });
    }
  };
});

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('root', {
    url: '/admin',
    template: '<div ui-view="main"></div>',
    controller: function() {},
    resolve: {
      currentUser: function(Admin, $rootScope) {
        return Admin.get().$promise.then(function(user) {
          $rootScope.currentUser = user;
        }, function(err) {
          if (err.status === 403) {
            window.location = '/noo/admin/login';
          }
        });
      }
    }
  })
  .state('communities', {
    parent: 'root',
    url: '/communities',
    views: {
      main: {
        templateUrl: '/ui/admin/communities.tpl.html',
        controller: function($scope, Community) {
          Community.query().$promise.then(cs => $scope.communities = _.sortBy(cs, c => c.slug));
        }
      }
    }
  })
  .state('metrics', {
    parent: 'root',
    url: '/metrics',
    resolve: {
      metrics: function(Admin) {
        return Admin.getMetrics().$promise;
      }
    },
    views: {
      main: {
        templateUrl: '/ui/admin/metrics.tpl.html',
        controller: function($scope, metrics) {
          $scope.newUsers = metrics.newUsers;
        }
      }
    }
  });
});

app.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
});

angular.element(document).ready(function() {
  angular.bootstrap(document.body, ['hyloAdmin'], {strictDi: true});
});
