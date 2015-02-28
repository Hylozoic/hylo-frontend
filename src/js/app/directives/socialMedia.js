var directive = function() {

  var controller = function($scope, $element) {
    console.log("controller works");
  };

  return {
    restrict: 'E',
    templateUrl: "/ui/app/socialMedia.tpl.html",
    controller: controller
  };
};

module.exports = function(angularModule) {
  angularModule.directive('socialMedia', directive);
};