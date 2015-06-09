var format = require('util').format,
  highlight = require('em-highlight'),
  pageSize = 5;

var controller = function($scope, $history, $analytics, growl, Search, searchCommunity, initialQuery) {
  $scope.query = initialQuery || '';
  $scope.searching = true;
  $scope.results = {
    posts_total: 0,
    people_total: 0,
    posts: [],
    people: []
  };
  var community = $scope.community = searchCommunity;
  var communityId = (community ? community.id : null);

  var fetch = _.debounce(function() {
    if ($scope.query.length <= 2) return;

    $analytics.eventTrack('Search', {query: $scope.query});
    $scope.searching = true;

    Search.get({
      q: $scope.query,
      communityId: communityId,
      include: ['posts', 'people'],
      limit: pageSize
    }, function(results) {
      $scope.results = results;
      $scope.searching = false;

      // FIXME this would be handy for bookmarking but it causes strange
      // behavior. i think ui-router is detecting a state change when it shouldn't.
      // var newUrl = format('%s?q=%s&c=%s',
      //   location.pathname, $scope.query, (communityId ? communityId : ''));
      // window.history.replaceState({}, 'Hylo', newUrl);
    })
  }, 500);

  $scope.$watch('query', fetch);

  $scope.close = function() {
    if ($history.isEmpty()) {
      $scope.$state.go('appEntry');
    } else {
      $history.go(-1);
    }
  };

  $scope.removePost = function(seed) {
    growl.addSuccessMessage("That seed has been removed.", {ttl: 5000});
    $scope.posts.splice($scope.posts.indexOf(seed), 1);
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
      return 'Groups: ' + _.map(person.organizations, function(org) {
        return highlight.find(org, query);
      }).join(', ');
    }
    return person.bio || format('Skills: %s<br/>Groups: %s',
      person.skills.join(', '), person.organizations.join(', '));
  };

  $scope.remaining = function(type) {
    return $scope.results[type + '_total'] - $scope.results[type].length;
  };

  $scope.pageSize = function(type) {
    return Math.min($scope.remaining(type), pageSize);
  };

  $scope.loadMore = function(type) {
    Search.get({
      q: $scope.query,
      communityId: communityId,
      include: [type],
      limit: pageSize,
      offset: $scope.results[type].length
    }, function(results) {
      $scope.results[type] = $scope.results[type].concat(results[type]);
    })
  };
};

module.exports = function(angularModule) {
  angularModule.controller('SearchCtrl', controller);
};