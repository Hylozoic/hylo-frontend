var directive = function($analytics) {

  var controller = function($scope, $element) {

    $scope.twitterUrl = function() {
      return 'https://twitter.com/' + $scope.user.twitter_name;
    };

    $scope.clickedSocialLink = function(network, url) {
      $analytics.eventTrack('Clicked a Social Media link', {'network': network, 'url': url, 'page': $scope.page});
    };
  };

  return {
    restrict: 'E',
    scope: {
      user: '=',
      page: '='
    },
    templateUrl: "/ui/app/socialMedia.tpl.html",
    controller: controller
  };
};

module.exports = function(angularModule) {
  angularModule.directive('socialMedia', directive);
};