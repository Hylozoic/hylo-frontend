window.rangy = require('rangy');
window.Undo = require('medium.js/node_modules/undo.js/undo');
var Medium = require('medium.js/medium');

var directive = function($sce, $timeout) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {
      if(!ngModel) return; // do nothing if no ng-model

      function read() {
        var html = element.html();
        if (html === '<br>' || html === '<p>&nbsp;</p>') {
          html = '';
        }

        ngModel.$setViewValue(html);
      }

      // update mediumEditor when ngModel updates
      // so that we can start out the contenteditable element
      // with pre-filled content, e.g. when editing an existing post.
      // this is the same as calling mediumEditor.value(ngModel.$viewValue),
      // except that it skips a call to makeUndoable(), which would trigger
      // a change event and cause a "digest in progress" error.
      ngModel.$render = function() {
        if (mediumEditor && typeof(ngModel.$viewValue) !== 'undefined') {
          mediumEditor.element.innerHTML = ngModel.$viewValue;
          mediumEditor.clean();
          mediumEditor.placeholders();
        }
      };

      var mediumEditor = new Medium({
        element: angular.element(element)[0],
        mode: Medium.partialMode,
        // placeholder: attrs.placeholder,
        autoHR: false,
        pasteAsText: true,
        tags: {
          innerLevel: ['br']
        }
      });

      scope.$on("$destroy", function handleDestroyEvent() {
        mediumEditor.destroy();
      });

      // Listen for change events to enable binding
      element.on('blur keyup change', function(e) {
        scope.$apply(read);
      });

      // commenting this out because it prevents setting an initial value with ng-model
      // read();
    }
  };
};

module.exports = function(angularModule) {
  angularModule.directive('contenteditable', directive);
};
