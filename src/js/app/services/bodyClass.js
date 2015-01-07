// generate a list of classes to add to the body tag,
// based on the current ui-router state
//
// add the state name, but also the parent's name if
// the state is a sub-view
//
module.exports = function(angularModule) {

  angularModule.factory('$bodyClass', ['$state', function($state) {
    return function() {
      var name = $state.current.name;

      if (name.match(/\./)) {
        return [name.split('.', 1)[0], name.replace('.', '-')];
      }

      return name;
    };
  }]);

};