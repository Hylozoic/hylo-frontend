var RichText = require('../../services/RichText');

module.exports = function($scope, $state, $anchorScroll, project, currentUser, growl, $stateParams, $modal) {
  "ngInject";

  var invitationToken = $stateParams.token;

  $scope.project = project;
  $scope.isCreator = $scope.canModerate = currentUser && project.user_id === currentUser.id;
  $scope.isContributor = project.is_contributor;

  $scope.details = RichText.present(project.details, {maxlength: 420});
  $scope.truncatedDetails = project.details && project.details.length > 420;

  $scope.showFullDetails = function() {
    $scope.details = RichText.present(project.details);
    $scope.truncatedDetails = false;
  };

  $scope.publish = function() {
    project.publish(function(resp) {
      project.published_at = resp.published_at;
      growl.addSuccessMessage('Published! You can unpublish from the Edit Project screen if you change your mind.');
    });
  };

  $scope.goToTab = function(name) {
    if ($state.current.name === 'project.' + name) {
      $anchorScroll('tabs');
    } else {
      $state.go('project.' + name, {id: project.slug, '#': 'tabs'});
    }
  };

  $scope.join = function() {
    var join = function() {
      project.join({token: invitationToken}, function() {
        // remove the token from the url
        window.history.replaceState({}, 'Hylo', location.pathname);

        $scope.isContributor = true;
        $scope.$broadcast('joinProject');
        growl.addSuccessMessage('You joined the project.');

      });
    };

    if (currentUser) {
      join();
      return;
    }

    var defaults = {
      backdrop: true,
      keyboard: false,
      windowClass: 'login-signup-modal',
      resolve: {
        context: function() { return 'modal' },
        projectInvitation: function() {
          return {projectToken: invitationToken, projectId: project.id};
        }
      }
    };

    var handle = function(result) {
      if (result.action === 'go') {
        open(result.state);
      } else if (result.action === 'finish') {
        join();
      }
    };

    var open = function(state) {
      var options = {};
      if (state === 'signup') {
        _.merge(options, {
          templateUrl: '/ui/user/signup.tpl.html',
          controller: 'SignupCtrl',
        }, defaults);
      } else if (state === 'login') {
        _.merge(options, {
          templateUrl: '/ui/user/login.tpl.html',
          controller: 'LoginCtrl',
        }, defaults);
      }
      $modal.open(options).result.then(handle);
    };

    open('login');

  };

}