var Medium = require('medium.js/medium');

var directive = function($sce, $filter, $timeout) {
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

      //update mediumEditor when ngModel updates
      ngModel.$render = function() {
        if (mediumEditor) mediumEditor.value(ngModel.$viewValue);
      };

      var mediumEditor = new Medium({
        element: angular.element(element)[0],
        mode: Medium.partialMode,
        // placeholder: attrs.placeholder,
        autoHR: false,
        pasteAsText: true,
        pasteEventHandler: function(e) {
          e.preventDefault();
          var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
          document.execCommand('insertText', false, text);
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