var factory = function($resource) {
  var Search = $resource('/noo/search');

  return Search;
};

module.exports = function(angularModule) {
  angularModule.factory('Search', factory);
};