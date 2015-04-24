var factory = function($resource) {
  var Invitation = $resource('/noo/invitation/:token', {
    token: '@token'
  }, {
    use: {
      url: '/noo/invitation/:token',
      method: 'POST'
    }
  });

  var storedInvitation;

  Invitation.store = function(data) {
    storedInvitation = data;
  };

  Invitation.storedData = function() {
    return storedInvitation;
  };

  return Invitation;
};

module.exports = function(angularModule) {
  angularModule.factory('Invitation', factory);
};