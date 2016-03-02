var RichText = require('../../services/RichText');

module.exports = function($scope, $anchorScroll, project, currentUser, growl,
  $stateParams, $modal, User, $dialog, $analytics, $rootScope, ModalLoginSignup) {
  "ngInject";

  var invitationToken = $stateParams.token;

  $scope.project = project;
  $scope.isCreator = currentUser && project.user_id === currentUser.id;
  $scope.canModerate = $scope.isCreator ||
    (project.membership && project.membership.role === 1) ||
    (currentUser && _.some(currentUser.memberships, m =>
      m.community.id === project.community_id && m.role === 1));
  $scope.isContributor = !!project.membership;

  $scope.details = RichText.markdown(project.details || '', {maxlength: 420});
  $scope.truncatedDetails = project.details && project.details.length > 420;

  // this is a hack to get user mention autocompletion working correctly
  // for comments in projects
  $rootScope.userMentionContext = {
    context: 'project',
    id: project.id
  };

  $rootScope.$on('$stateChangeStart', function(event, toState) {
    if (!toState.name.startsWith('project'))
      $rootScope.userMentionContext = null;
  });

  $scope.showFullDetails = function() {
    $scope.details = RichText.markdown(project.details);
    $scope.truncatedDetails = false;
  };

  $scope.publish = function() {
    project.publish(function(resp) {
      project.published_at = resp.published_at;
      growl.addSuccessMessage('Published! You can unpublish from the Edit Project screen if you change your mind.');
    });
  };

  $scope.goToTab = function(name) {
    if ($scope.$state.current.name === 'project.' + name) {
      $anchorScroll('tabs');
    } else {
      $scope.$state.go('project.' + name, {id: project.slug, '#': 'tabs'});
    }
  };

  var join = function(callback) {
    project.join({token: invitationToken}, function() {
      // remove the token from the url
      window.history.replaceState({}, 'Hylo', location.pathname);

      $scope.isContributor = true;
      $scope.$broadcast('joinProject');
      growl.addSuccessMessage('You joined the project.');
      $analytics.eventTrack('Joined project', {project_id: project.id});
      if (callback) callback();
    });
  };

  $scope.join = function () {
    if (currentUser) {
      join()
      return
    }

    ModalLoginSignup.start({
      resolve: {
        projectInvitation: function() {
          return {projectToken: invitationToken, projectId: project.id}
        }
      },
      finish: () => join(() => $scope.$state.reload())
    })
  }

  $scope.$on('unauthorized', function(event, data) {
    if (_.contains(['comment', 'like', 'follow'], data.context)) {
      $dialog.confirm({message: "You must join this project to do that."})
      .then(function() {
        $scope.join();
      });
    }
  });

  $scope.share = function() {
    FB.ui({
      method: 'share',
      href: window.location.href,
    }, function(response){});
  };

}
