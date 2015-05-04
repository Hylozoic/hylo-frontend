var factory = function($resource) {
  return $resource('/noo/project');
};

module.exports = function(angularModule) {
  angularModule.factory('Project', factory);
};