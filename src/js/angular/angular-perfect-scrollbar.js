angular.module('perfect_scrollbar', []).directive('perfectScrollbar',
    ['$parse', '$window', function($parse, $window) {
      var psOptions = [
        'wheelSpeed', 'wheelPropagation', 'minScrollbarLength', 'useBothWheelAxes',
        'useKeyboard', 'suppressScrollX', 'suppressScrollY', 'scrollXMarginOffset',
        'scrollYMarginOffset', 'includePadding'
      ];

      return {
        restrict: 'EA',
        transclude: true,
        template: '<div><div ng-transclude></div></div>',
        replace: true,
        link: function($scope, $elem, $attr) {
          var jqWindow = angular.element($window);
          var options = {};

          for (var i=0, l=psOptions.length; i<l; i++) {
            var opt = psOptions[i];
            if ($attr[opt] !== undefined) {
              options[opt] = $parse($attr[opt])();
            }
          }

          $scope.$evalAsync(function() {
            $elem.perfectScrollbar(options);
          });

          function update() {
            $scope.$evalAsync(function() {
              $elem.perfectScrollbar('update');
            });

            // This is necessary if you aren't watching anything for refreshes
            if(!$scope.$$phase) {
              $scope.$apply();
            }
          }

          // This is necessary when you don't watch anything with the scrollbar
          $elem.bind('mouseenter', update);

          // Possible future improvement - check the type here and use the appropriate watch for non-arrays
          if ($attr.refreshOnChange) {
            $scope.$watchCollection($attr.refreshOnChange, function() {
              update();
            });
          }

          // this is from a pull request - I am not totally sure what the original issue is but seems harmless
          if ($attr.refreshOnResize) {
            jqWindow.on('resize', update);
          }

          $elem.bind('$destroy', function() {
            jqWindow.off('resize', update);
            $elem.perfectScrollbar('destroy');
          });

        }
      };
    }]);
