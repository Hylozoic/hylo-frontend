var Medium = require('medium.js/medium');

var dependencies = ['$sce', '$filter'];
dependencies.push(function($sce, $filter) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {
      if(!ngModel) return; // do nothing if no ng-model

      function read() {
        var html = element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if (attrs.stripBr && html === '<br>') {
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
        placeholder: attrs.placeholder,
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

      read(); // initialize
    }
  };
});

module.exports = function(angularModule) {
  angularModule.directive('contenteditable', dependencies);
}