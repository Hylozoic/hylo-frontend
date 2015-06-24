module.exports = function(Community, User, $rootScope) {
  'ngInject';
  return {
    userTextRaw: function(user) {
      return format(
        '<a contenteditable="false" tabindex="-1" target="_blank" href="/u/%s" data-user-id="%s">@%s</a>',
        user.id, user.id, user.name);
    },

    searchPeople: function(query, context, id) {
      if (context === 'community') {
        return Community.findMembers({id: id, autocomplete: query, limit: 5});
      } else if (context === 'project') {
        return User.autocomplete({projectId: id, q: query});
      } else {
        return User.autocomplete({q: query});
      }
    }

  };
};