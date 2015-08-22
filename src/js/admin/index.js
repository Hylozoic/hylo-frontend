require('angular-ui-router')
require('angular-resource')

var app = angular.module('hyloAdmin', ['ngResource', 'ui.router', 'ngTagsInput'])
var Chart = require('./services/Chart')

require('../app/services/Community')(app)
require('../app/services/Project')(app)
require('../app/directives/masonry')(app)
require('../app/filters')(app)

app.factory('Admin', require('./services/Admin'))

app.directive('chart', function () {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      setup: '='
    },
    replace: true,
    template: '<div><svg></svg></div>',
    link: function (scope, element, attrs) {
      element.addClass('chart')

      Chart.render({
        data: scope.data,
        to: element.find('svg')[0],
        type: attrs.type || 'bar',
        setup: scope.setup
      })
    }
  }
})

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('root', {
      url: '/admin',
      template: '<div ui-view="main"></div>',
      controller: function () {},
      resolve: {
        currentUser: function (Admin, $rootScope) {
          return Admin.get().$promise.then(function (user) {
            $rootScope.currentUser = user
          }, function (err) {
            if (err.status === 403) {
              window.location = '/noo/admin/login'
            }
          })
        }
      }
    })
    .state('communities', {
      parent: 'root',
      url: '/communities',
      views: {
        main: {
          templateUrl: '/admin/communities.tpl.html',
          controller: function ($scope, Community) {
            $scope.sortKey = 'name'
            $scope.sortOrder = 'asc'

            Community.query().$promise.then(cs => {
              $scope.communities = cs
              $scope.resort()
            })

            $scope.resort = function () {
              $scope.communities = _.sortByOrder($scope.communities, [$scope.sortKey], [$scope.sortOrder])
              $scope.$broadcast('masonry.update')
            }
          }
        }
      }
    })
    .state('metrics', {
      parent: 'root',
      url: '/metrics',
      resolve: {
        metrics: function (Admin) {
          return Admin.getMetrics().$promise
        }
      },
      views: {
        main: {
          templateUrl: '/admin/metrics.tpl.html',
          controller: function ($scope, metrics) {
            $scope.metrics = metrics

            $scope.setupNewUserActivity = function (chart) {
              chart.yDomain([0, 1])
            }
          }
        }
      }
    })
})

app.config(function ($locationProvider) {
  $locationProvider.html5Mode(true)
})

angular.element(document).ready(function () {
  angular.bootstrap(document.body, ['hyloAdmin'], {strictDi: true})
})
