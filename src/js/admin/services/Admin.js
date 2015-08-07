module.exports = function($resource) {
  'ngInject';
  return $resource('/noo/admin/:id', {
    id: '@id'
  }, {
    getMetrics: {
      url: '/noo/admin/metrics'
    }
  });
};
