angular.module("hyloDirectives")

.factory('jsService', ["$http", function($http) {
  return {
    getJs: function(path) {

      return $http.get(path).then(function(response) {
        deferred.resolve(response.data);
      });

    }
  }
}])

.directive('lazyLoader', ["$compile", "$q", "jsService", function($compile, $q, jsService) {
  var directiveReturn = {
    restrict: 'A',
    scope: {
      lazyFile: '=',
      lazyDirective: '='
    },
    link: function(scope, element) {
      console.log("lazyLoader")
      jsService.getJs(scope.lazyFile).then(function(data) {
        console.log("gettingscript")
        return addScript(scope.lazyFile, data, scope);
      }).then(function() {
        var $span = angular.element('<span></span>').attr(scope.lazyDirective, '');
        $compile($span)(scope);
        element.append($span);
      });
    }
  }

  var scriptPromises = {};
  function addScript(file, js, scope) {
    if (!scriptPromises[file]) { //if this controller hasn't already been loaded
      var deferred = $q.defer();
      //cache promise)
      scriptPromises[file] = deferred.promise;

      //inject js into a script tag
      var script = document.createElement('script');
      script.src = 'data:text/javascript,' + encodeURI(js);
      script.onload = function() {
        //now the script is ready for use, resolve promise to add the script's directive element
        scope.$apply(deferred.resolve());
      };
      document.body.appendChild(script);
      return deferred.promise;
    }
    else { //this script has been loaded before
      return scriptPromises[loadFile]; //return the resolved promise from cache
    }
  }

  return directiveReturn;
}]);
