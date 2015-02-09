module.exports = function(angularModule) {

  angularModule.service('UserMentions', ['$q', function($q) {
    return {
      userTextRaw: function(user) {
        return '<a contenteditable="false" tabindex="-1" target="_blank" href="/u/' + user.id + '" data-user-id="' + user.id + '">@' + user.name + '</a>'
      },

      searchPeople: function(query, community) {
        var peopleList = [];
        return community.members({search: query, limit: 5}).$promise.then(function (items) {
          angular.forEach(items, function(item) {
            if (item.name.toUpperCase().indexOf(query.toUpperCase()) >= 0) {
              peopleList.push(item);
            }
          });
          return peopleList;
        });
      }

    };
  }]);
};
