module.exports = function($resource) {
  'ngInject';
  return $resource('/noo/admin/:id');
};