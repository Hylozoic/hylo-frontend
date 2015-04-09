var heightAndTopMargin = function(element) {
  return parseInt(element.clientHeight) + parseInt(getComputedStyle(element).marginTop);
}

module.exports = function(angularModule) {
  angularModule.animation('.fade-in', function() {
    return {
      addClass: function(element, className) {
        element.css({opacity: 1, display: 'block'});
        // TweenLite.to(element, 0.5, {opacity: 1, display: 'block'});
      },
      removeClass: function(element, className) {
        TweenLite.to(element, 0.5, {opacity: 0, display: 'none'});
      }
    };
  })
  .animation('.drop-in', function($timeout) {
    return {
      addClass: function(element, className) {
        element.css('display', 'block');
        element.css('top', -heightAndTopMargin(element[0]) + 'px');
        $timeout(function() { TweenLite.to(element, 0.5, {top: 0}) }, 0);
      },
      removeClass: function(element, className) {
        element.css('top', -heightAndTopMargin(element[0]) + 'px');
        // TweenLite.to(element, 0.5, {top: -element.outerHeight()});
      }
    };
  });
}