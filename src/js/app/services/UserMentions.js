module.exports = function(Community, User, $rootScope) {
  'ngInject';
  return {
    userTextRaw: function(user) {
      return format(
        '<a contenteditable="false" tabindex="-1" target="_blank" href="/u/%s" data-user-id="%s">@%s</a>',
        user.id, user.id, user.name);
    },

    searchPeople: function(query, community) {
      if (community) {
        return Community.findMembers({id: community.id, autocomplete: query, limit: 5});
      } else {
        return User.autocomplete({q: query});
      }
    }

  };
};