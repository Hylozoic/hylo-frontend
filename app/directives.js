angular.module('hyloDirectives', ['ngResource', 'hyloFilters']).

directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
}).

directive('ngFocusMe', ['$timeout', '$parse', '$window', function($timeout, $parse, $window) {
  return {
    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs) {
      var model = $parse(attrs.ngFocusMe);
      scope.$watch(model, function(value) {
        if(value === true) {
          var rect = element[0].getBoundingClientRect();

          // Test to see if the comment box is within the viewport... if it is, just focus without scrolling
          if (rect.top >= 0 &&
              rect.left >= 0 &&
              rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
              rect.right <= (window.innerWidth || document.documentElement.clientWidth)) {

            $timeout(function() {
              element[0].focus();
            }, 1);
          } else {
            $('html,body').animate({
              scrollTop: $(element[0]).offset().top - ($($window).height() - 190)
            }, {
              duration: 300,
              done: function() {
                element[0].focus();
              }
            });
          }
        }
      });
      // to address @blesh's comment, set attribute value to 'false'
      // on blur event:
      element.bind('blur', function() {
        scope.$apply(model.assign(scope, false));
      });
    }
  };
}]).

directive('seedText', ['$sce', '$compile', '$filter', '$parse', function($sce, $compile, $filter, $parse) {
    return {
      restrict: 'A',
      replace: true,
      template: '<div></div>',
      transclude: 'element',
      link: function(scope, iElement, iAttrs, controller, $transclude) {
        var parsed = $parse(iAttrs.seedText);
        function getStringValue() { return (parsed(scope) || '').toString(); }

        scope.$watch(getStringValue, function seedTextWatchFn(value) {

          /* Filter the seed text */
          var linkyText = $filter('linky')(value, '_blank');
          var linkyShortText = $filter('linkyShort')(linkyText);
          var carriageReturnText = $filter('convertCarriageReturn')(linkyShortText);


          var hashedText = $filter('hashtag')(carriageReturnText);

          var paddedVal = '<span>' + $sce.getTrustedHtml(hashedText) + '</span>'

          iElement.html($compile(paddedVal)(scope));
        });
      }
    }
}]).

directive('dotdotdot', ['$timeout', function($timeout) {
  return function(scope, element, attrs) {
    // this is almost certainly not the "right" way to do this,
    // but it works...
    $timeout(function() { angular.element(element).dotdotdot() }, 0);
    return {
      restrict: 'A',
      transclude: true
    }
  }
}]).

directive('backImg', [function() {
  function link(scope, element, attrs) {
    scope.$watch(attrs.backImg, function(value) {
      if (!value) return;
      var url = value;
      element.css({
        'background-image': 'url(' + url +')'
      });
    });
  }

  return {
    link: link
  };
}]).

directive('fitHeightToParent', function() {
  return function(scope, element, attrs) {
    scope.$watch(function() { return $(element).position().top }, function(top) {
      var heightDiff = document.documentElement.clientHeight - top;
      if (heightDiff > 0) element.css({height: heightDiff, overflow: 'scroll'});
    })
    return {
      restrict: 'A',
      transclude: true
    };
  }
});

