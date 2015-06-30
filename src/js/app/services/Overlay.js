module.exports = function($rootScope) {
  'ngInject';
  // just need a state object here
  // in order to account for the fact that sometimes
  // when we want to set up the overlay, OverlayCtrl
  // has not yet been initialized
  var storedData;

  return {
    show: function(data) {
      storedData = data;
      $rootScope.$emit('overlay:load', data);
    },
    resetData: function() {
      storedData = null;
    },
    storedData: function() {
      return storedData;
    }
  };
};
