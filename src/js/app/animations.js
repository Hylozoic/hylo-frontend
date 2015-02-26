module.exports = function(angularModule) {
  angularModule.animation('.fade-in', function() {
    return {
      addClass: function(element, className) {
        TweenLite.to(element, 0.8, {opacity: 1, display: 'block'});
      },
      removeClass: function(element, className) {
        TweenLite.to(element, 0.8, {opacity: 0, display: 'none'});
      }
    };
  })
  .animation('.drop-in', function($timeout) {
    return {
      addClass: function(element, className) {
        element.css('display', 'block');
        element.css('top', -element.outerHeight());
        $timeout(function() { TweenLite.to(element, 0.5, {top: 0}) }, 0);
      },
      removeClass: function(element, className) {
        element.css('top', -element.outerHeight());
        // TweenLite.to(element, 0.5, {top: -element.outerHeight()});
      }
    };
  });
}