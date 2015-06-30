module.exports = function(angularModule) {

  angularModule.directive('touchClass', function() {
    return function(scope, element, attrs) {
      element.on('touchstart', function() {
        element.addClass(attrs.touchClass);
      });
      element.on('touchend', function() {
        element.removeClass(attrs.touchClass);
      });
    };
  });

};
