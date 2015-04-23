var format = require('util').format;

var factory = function() {

  return {
    openPopup: function(service) {
      var width, height;

      if (service === 'google') {
        width = 420;
        height = 480;
        size = {width: 420, height: 480};
      } else if (service === 'facebook') {
        width = 560;
        height = 520;
      } else if (service === 'linkedin') {
        width = 400;
        height = 584;
      }

      // n.b. positioning of the popup is off on Chrome with multiple displays
      return window.open(
        '/noo/login/' + service,
        service + 'Auth',
        format('width=%s, height=%s, left=%s, top=%s, titlebar=no, toolbar=no, menubar=no',
          width,
          height,
          document.documentElement.clientWidth/2 - width/2,
          document.documentElement.clientHeight/2 - height/2
        )
      );
    }
  };
};

module.exports = function(angularModule) {
  angularModule.factory('ThirdPartyAuth', factory);
};