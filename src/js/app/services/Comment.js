var service = function($resource) {
  return $resource('/noo/comment/:id', {id: '@id'}, {
    thank: {
      method: 'POST',
      url: '/noo/comment/:id/thank'
    }
  });
};

module.exports = function(angularModule) {
  angularModule.factory('Comment', service);
};
