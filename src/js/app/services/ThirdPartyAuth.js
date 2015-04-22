var format = require('util').format;

var factory = function() {

  return {
    openPopup: function(service) {
      // vertical positioning is ignored... wonder why

      if (service === 'google') {
        var width = 420,
          height = 480,
          left = document.documentElement.clientWidth/2 - width/2,
          top = document.documentElement.clientHeight/2 - height/2;

        return window.open(
          '/noo/login/google',
          'googleAuth',
          format('width=%s, height=%s, titlebar=no, toolbar=no, menubar=no, left=%s, top=%s', width, height, left, top)
        );

      } else if (service === 'facebook') {
        var width = 560,
          height = 520,
          left = document.documentElement.clientWidth/2 - width/2,
          top = document.documentElement.clientHeight/2 - height/2;

        return window.open(
          '/noo/login/facebook',
          'facebookAuth',
          format('width=%s, height=%s, titlebar=no, toolbar=no, menubar=no, left=%s, top=%s', width, height, left, top)
        );

      }
    }
  };
};

module.exports = function(angularModule) {
  angularModule.factory('ThirdPartyAuth', factory);
};