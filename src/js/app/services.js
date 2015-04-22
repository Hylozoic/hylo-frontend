var angularModule = angular.module('hyloServices', ['ngResource']).

factory('Overlay', function($rootScope) {
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
});

// resources
require('./services/user')(angularModule);
require('./services/community')(angularModule);
require('./services/Activity')(angularModule);
require('./services/Comment')(angularModule);
require('./services/Search')(angularModule);
require('./services/Seed')(angularModule);

// other services
require('./services/bodyClass')(angularModule);
require('./services/onboarding')(angularModule);
require('./services/clickthroughTracker')(angularModule);
require('./services/history')(angularModule);
require('./services/dialog')(angularModule);
require('./services/Cache')(angularModule);
require('./services/UserCache')(angularModule);
require('./services/ThirdPartyAuth')(angularModule);
require('./services/popupDone');