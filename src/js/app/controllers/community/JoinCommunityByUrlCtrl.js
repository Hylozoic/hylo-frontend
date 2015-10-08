module.exports = function($scope, $controller, community, code, currentUser, $modal) {
  'ngInject';

  $scope.community = community;
  $scope.code = code;

  // TODO: Refactor the common code here with ProjectCtrl.js
  if (!currentUser) {
    var defaults = {
      backdrop: true,
      keyboard: false,
      windowClass: 'login-signup-modal',
      resolve: {
        context: function() { return 'modal' },
        projectInvitation: null
      }
    };

    var handle = function(result) {
      if (result.action === 'go') {
        open(result.state);
      } else if (result.action === 'finish') {
        $scope.$state.reload();
      }
    };

    var open = function(state) {
      var options = {};
      if (state === 'signup') {
        _.merge(options, {
          templateUrl: '/ui/entrance/signup.tpl.html',
          controller: 'SignupCtrl',
        }, defaults);
      } else if (state === 'login') {
        _.merge(options, {
          templateUrl: '/ui/entrance/login.tpl.html',
          controller: 'LoginCtrl',
        }, defaults);
      } else if (state === 'forgotPassword') {
        _.merge(options, {
          templateUrl: '/ui/entrance/forgot-password.tpl.html',
          controller: 'ForgotPasswordCtrl',
        }, defaults);
      }
      $modal.open(options).result.then(handle);
    };

    open('signup');

  } else {
    $scope.alreadyJoined = !!_.find(currentUser.memberships, m => m.community_id === community.id);

    // Put functions from JoinCommunityCtrl onto $scope.
    $controller('JoinCommunityCtrl', {$scope: $scope})

    // Validate the community join code from last part of the URL.
    $scope.validateCode();
  }
};
