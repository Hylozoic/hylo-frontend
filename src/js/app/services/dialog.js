
// show bootstrap modals for dialogs instead of browser-native UI

var factory = function($modal) {
  return {
    confirm: function(opts) {
      return $modal.open({
        backdrop: true,
        templateUrl: '/ui/shared/confirm.tpl.html',
        controller: function($scope) {
          $scope.message = opts.message;
        }
      }).result;
    }
  };
};

module.exports = function(angularModule) {
  angularModule.factory('$dialog', factory);
};