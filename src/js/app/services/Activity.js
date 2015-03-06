var service = function($resource) {
  return $resource('/noo/activity/:id', {id: '@id'}, {
    markAllRead: {
      method: 'POST',
      url: '/noo/activity',
      params: {
        action: 'markAllRead'
      }
    }
  });
};

module.exports = function(angularModule) {
  angularModule.factory('Activity', service);
};
