var service = function($resource) {
  return $resource('/noo/activity/:id', {id: '@id'}, {
    markAllRead: {
      method: 'POST',
      url: '/noo/activity/mark-all-read'
    }
  });
};

module.exports = function(angularModule) {
  angularModule.factory('Activity', service);
};
