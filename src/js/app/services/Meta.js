module.exports = function($rootScope) {
  'ngInject';

  $rootScope.meta = {};

  return {
    set: function(properties) {
      _.merge($rootScope.meta, properties);
    }
  };
};