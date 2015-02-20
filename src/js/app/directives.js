var angularModule = angular.module('hyloDirectives', ['ngResource', 'hyloFilters']);

require('./directives/contenteditable')(angularModule);
require('./directives/hylo_post')(angularModule);

angularModule.directive('ngEnter', function() {
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

directive('fadeIf', function($animate) {
  return function(scope, element, attrs) {
    scope.$watch(attrs.fadeIf, function(val) {
      if (val) {
        $animate.addClass(element, 'fade');
      }
    })
  }
}).

// https://gist.github.com/kirkstrobeck/599664399dbc23968741
directive('autofocus', function ($timeout) {
  return {
    restrict: 'A',
    link: function ($scope, $element) {
      $timeout(function () {
        $element[0].focus();
      });
    }
  };
}).

directive('seedText', ['$sce', '$compile', '$filter', '$parse', function($sce, $compile, $filter, $parse) {
    return {
      restrict: 'A',
      replace: true,
      template: '<span></span>',
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
  return {
    link: function linkDotDotDot(scope, element) {
      scope.$watch(function() {
        element.dotdotdot({watch: true});
      });
    }
  };
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

/**
 * ng-wrapper for draggable-background.js https://github.com/kentor/jquery-draggable-background
 * <div class="banner" back-img="createForm.banner" // must be watching some back-img element.
 *      image-drag="setBannerPos(position)" // value is a function to be called with the new position after drag is done
 *      image-drag-axis="y">   // Can be 'x' or 'y'
 */
directive('imageDrag', ['$timeout', '$parse', function($timeout, $parse) {
  function link(scope, element, attrs) {
    scope.$watch(attrs.backImg, function(value) {
      var fn = $parse(attrs.imageDrag);
      if (!value) return;
      $timeout(function() { angular.element(element).backgroundDraggable({
        axis: attrs.imageDragAxis,
        done: function() {
          backgroundPosition = angular.element(element).css('background-position');
          fn(scope, {position: backgroundPosition})
        }
      })}, 0);
    });
  }

  return {
    link: link
  };
}]).

directive('hyloUnique', ['$http', function ($http) {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      elem.on('blur', function (evt) {
        scope.$apply(function () {
          var val = elem.val();
          var extraData = _.isEmpty(attrs.hyloUniqueExtra) ? null : attrs.hyloUniqueExtra;
          var req = { "value": val, "dbField": attrs.hyloUnique, "extra": extraData}
          var ajaxConfiguration = { method: 'POST', url: 'checkunique', data: req };
          $http(ajaxConfiguration)
              .success(function(data, status, headers, config) {
                ctrl.$setValidity('unique', data.unique);
              });
        });
      });
    }
  }
}
]).

directive('forceLowercase', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      var lowercase = function(inputValue) {
        if(inputValue == undefined) inputValue = '';
        var lowercased = inputValue.toLowerCase();
        if(lowercased !== inputValue) {
          modelCtrl.$setViewValue(lowercased);
          modelCtrl.$render();
        }
        return lowercased;
      }
      modelCtrl.$parsers.push(lowercase);
      lowercase(scope[attrs.ngModel]);  // capitalize initial value
    }
  };
}).

directive("loadingIndicator", function() {
    return {
      template: '<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
    };
}).

directive('btnLoading',function () {
  return {
    link:function (scope, element, attrs) {
      scope.$watch(
          function () {
            return scope.$eval(attrs.btnLoading);
          },
          function (value) {
            if(value) {
              if (!attrs.hasOwnProperty('ngDisabled')) {
                element.addClass('disabled').attr('disabled', 'disabled');
              }

              element.data('resetText', element.html());
              element.html(element.data('loading-text'));
            } else {
              if (!attrs.hasOwnProperty('ngDisabled')) {
                element.removeClass('disabled').removeAttr('disabled');
              }

              element.html(element.data('resetText'));
            }
          }
      );
    }
  };
});