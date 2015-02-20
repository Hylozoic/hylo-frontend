module.exports = function(angularModule) {
  angularModule.animation('.fade', function() {
    return {
      addClass: function(element, className) {
        TweenLite.to(element, 1.2, {opacity: 0});
      },
      removeClass: function(element, className) {
        TweenLite.to(element, 1.2, {opacity: 1});
      }
    };
  });
}