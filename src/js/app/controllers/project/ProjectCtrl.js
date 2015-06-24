var RichText = require('../../services/RichText');

module.exports = function($scope, $anchorScroll, project, currentUser, growl,
  $stateParams, $modal, User, $dialog, Meta, $analytics, $rootScope) {
  "ngInject";

  Meta.set({
    og: {
      url: window.location.href,
      title: project.title,
      image: (project.image_url || project.thumbnail_url),
      description: project.intention
    }
  });

  var invitationToken = $stateParams.token;

  $scope.project = project;
  $scope.isCreator = $scope.canModerate = currentUser && project.user_id === currentUser.id;
  $scope.isContributor = !!project.membership;

  $scope.details = RichText.present(project.details, {maxlength: 420});
  $scope.truncatedDetails = project.details && project.details.length > 420;

  // this is a hack to get user mention autocompletion working correctly
  // for comments in projects
  $rootScope.userMentionContext = {
    context: 'project',
    id: project.id
  };

  $rootScope.$on('$stateChangeStart', function() {
    $rootScope.userMentionContext = null;
  });

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
    if ($scope.$state.current.name === 'project.' + name) {
      $anchorScroll('tabs');
    } else {
      $scope.$state.go('project.' + name, {id: project.slug, '#': 'tabs'});
    }
  };

  $scope.join = function() {
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
        join(function() {
          $scope.$state.reload();
        });
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

  };

  $scope.$on('unauthorized', function(event, data) {
    if (_.contains(['comment', 'like', 'follow', 'add-members'], data.context)) {
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