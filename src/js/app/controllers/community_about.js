angular.module("hyloControllers").controller('AboutCommunityCtrl', ['$scope', '$rootScope', '$analytics', '$state',
  function($scope, $rootScope, $analytics, $state) {

  	$scope.community = $rootScope.community;

  }]);