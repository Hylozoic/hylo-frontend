var factory = function($resource) {
  var Network = $resource('/noo/network/:id', {
    id: '@id'
  });

  return Network;
};

module.exports = function(angularModule) {
  angularModule.factory('Network', factory);
};