module.exports = function($stateProvider) {

  $stateProvider
  .state('network', {
    url: "/n/:slug",
    parent: 'main',
    abstract: true,
    resolve: {
      network: /*@ngInject*/ function(Network, $stateParams) {
        return Network.get({id: $stateParams.slug}).$promise;
      }
    },
    views: {
      main: {
        templateUrl: '/ui/app/network.tpl.html',
        controller: 'NetworkCtrl'
      }
    }
  })
  .state('network.seeds', {
    url: '',
    resolve: {

    },
    views: {
      tab: {
        template: '',
        controller: function($scope) {
          'ngInject';
        }
      }
    }
  })
  .state('network.communities', {
    url: '/communities',
    resolve: {

    },
    views: {
      tab: {
        template: '',
        controller: function($scope) {
          'ngInject';
        }
      }
    }
  })
  .state('network.about', {
    url: '/about',
    resolve: {

    },
    views: {
      tab: {
        templateUrl: '/ui/network/about.tpl.html',
        controller: function($scope, network) {
          'ngInject';
          $scope.network = network;
        }
      }
    }
  });

};