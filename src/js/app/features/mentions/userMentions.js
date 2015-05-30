module.exports = function(angularModule) {

  angularModule.service('UserMentions', function(Community, User) {
    return {
      userTextRaw: function(user) {
        return '<a contenteditable="false" tabindex="-1" target="_blank" href="/u/' + user.id + '" data-user-id="' + user.id + '">@' + user.name + '</a>'
      },

      searchPeople: function(query, community) {
        if (community) {
          return Community.findMembers({id: community.id, autocomplete: query, limit: 5});
        } else {
          return User.autocomplete({q: query});
        }
      }

    };
  });
};
