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
        controller: function($scope, network) {
          'ngInject';
          $scope.network = network;
        }
      }
    }
  })
  .state('network.posts', {
    url: '',
    resolve: {
      firstPostQuery: /*@ngInject*/ function(network, Seed) {
        return Seed.queryForNetwork({id: network.id, limit: 10}).$promise;
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/network/posts.tpl.html',
        controller: function($scope, network, firstPostQuery, PostManager, Seed) {
          'ngInject';

          var postManager = new PostManager({
            firstPage: firstPostQuery,
            scope: $scope,
            attr: 'posts',
            query: function() {
              return Seed.queryForNetwork({
                id: network.id,
                limit: 10,
                offset: $scope.posts.length
              }).$promise;
            }
          });

          postManager.setup();
        }
      }
    }
  })
  .state('network.communities', {
    url: '/communities',
    resolve: {
      communities: /*@ngInject*/ function(network) {
        return network.communities().$promise;
      }
    },
    views: {
      tab: {
        templateUrl: '/ui/network/communities.tpl.html',
        controller: function($scope, communities) {
          'ngInject';
          $scope.communities = communities;
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