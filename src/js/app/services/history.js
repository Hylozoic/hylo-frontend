// adapted from:
// http://plnkr.co/edit/DJH6mQUCbTFfSbdCBYUo?p=preview
// https://github.com/angular-ui/ui-router/issues/92

var service = function($state, $rootScope, $window) {

  var history = [], going = false;

  angular.extend(this, {
    push: function(state, params) {
      if (going) {
        going = false;
      } else {
        history.push({ state: state, params: params });
      }
    },
    all: function() {
      return history;
    },
    isEmpty: function() {
      return history.length == 0;
    },
    go: function(step) {
      var index = history.length + (step || -1), prev = history[index];

      history = history.slice(0, index);
      going = true;

      return $state.go(prev.state, prev.params);
    },
    back: function() {
      return this.go(-1);
    }
  });

};

var run = function($history, $state, $rootScope) {
  $rootScope.$on("$stateChangeSuccess", function(event, to, toParams, from, fromParams) {
    if (!from.abstract) {
      $history.push(from, fromParams);
    }
  });

  if (!$state.current.abstract) {
    $history.push($state.current, $state.params);
  }
};

module.exports = function(angularModule) {
  angularModule.service('$history', service).run(run);
};