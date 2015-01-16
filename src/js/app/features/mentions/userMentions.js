module.exports = function(angularModule) {

  angularModule.service('UserMentions', ['$q', function($q) {
    return {
      userTextRaw: function(user) {
        return '<a contenteditable="false" tabindex="-1" target="_blank" href="/u/' + user.id + '" data-user-id="' + user.id + '">@' + user.name + '</a>'
      }
    };
  }]);
};
