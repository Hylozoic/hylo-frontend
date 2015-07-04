// Use this only if you can't get the currentUser resolve dependency from ui-router.

module.exports = function(User) {
  'ngInject';
  var user;
  var api = {
    set: u => user = u,
    get: () => user,
    is: id => user && user.id === id,
    isLoggedIn: () => !!user,

    load: () =>
      User.current().$promise.then(resp =>
        _.tap(resp.id ? resp : null, user => {
          api.set(user);
          window.hyloEnv.provideUser(user);
        }))
  };
  return api;
};
