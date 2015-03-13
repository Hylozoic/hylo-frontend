var format = require('util').format,
  highlight = require('em-highlight');

var controller = function($scope, $history, searchCommunity, query, Search, growl) {
  $scope.query = query || '';
  $scope.searching = true;
  $scope.seeds = [];
  $scope.people = [];
  var community = $scope.community = searchCommunity;
  var communityId = (community ? community.id : null);

  var fetch = _.debounce(function(query) {
    if (query.length <= 2) return;

    var newUrl = format('%s?q=%s&c=',
      location.pathname, query, (communityId ? communityId : ''));
    window.history.replaceState({}, 'Hylo', newUrl);

    $scope.searching = true;
    Search.get({
      q: query,
      communityId: communityId,
      include: ['seeds', 'people'],
      limit: 5
    }, function(results) {
      $scope.seeds = results.seeds;
      $scope.people = results.people;
      $scope.searching = false;
    })
  }, 500);

  $scope.$watch('query', fetch);

  $scope.close = function() {
    if ($history.isEmpty()) {
      $scope.$state.go('home');
    } else {
      $history.go(-1);
    }
  };

  $scope.removeSeed = function(seed) {
    growl.addSuccessMessage("That seed has been removed.", {ttl: 5000});
    $scope.seeds.splice($scope.seeds.indexOf(seed), 1);
  };

  $scope.name = function(person) {
    return highlight.find(person.name, $scope.query);
  };

  $scope.blurb = function(person) {
    var query = $scope.query, pattern = new RegExp(query, 'i');

    if (person.bio && person.bio.match(pattern)) {
      return highlight.find(person.bio, query);

    } else if (_.any(person.skills, function(skill) { return !!skill.match(pattern); })) {
      return 'Skills: ' + _.map(person.skills, function(skill) {
        return highlight.find(skill, query);
      }).join(', ');

    } else if (_.any(person.organizations, function(org) { return !!org.match(pattern); })) {
      return 'Affiliations: ' + _.map(person.organizations, function(org) {
        return highlight.find(org, query);
      }).join(', ');
    }
    return person.bio || format('Skills: %s<br/>Affiliations: %s',
      person.skills.join(', '), person.organizations.join(', '));
  };
};

module.exports = function(angularModule) {
  angularModule.controller('SearchCtrl', controller);
};