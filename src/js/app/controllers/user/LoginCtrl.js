var handleError = function (err, $scope, $analytics) {
  var msg = err.data
  if (!msg) {
    $scope.loginError = "Couldn't log in. Please try again."
    window.Rollbar.error('Login failure', {email: $scope.user.email})
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: 'unknown'})
    return
  }

  var noPasswordMatch = msg.match(/password account not found. available: \[(.*)\]/)
  if (noPasswordMatch) {
    var options = noPasswordMatch[1].split(',')
    if (options[0] === '') {
      $scope.loginError = format("Your account has no password set. <a href='/forgot-password'>Set your password</a>")
    } else {
      $scope.loginError = format('Your account has no password set. Please log in with %s.',
        _.map(options, function (x) { return _.capitalize(x) }).join(' or '))
    }
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: 'non-password account'})

  } else if (msg === 'password does not match') {
    $scope.loginError = 'The password you entered is incorrect.'
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: 'bad password'})

  } else if (msg === 'email not found') {
    $scope.loginError = 'The email address you entered was not recognized.'
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: 'bad email'})

  } else if (msg === 'no community') {
    $scope.loginError = 'You are not a member of any community yet. Please sign up first.'
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: 'no community'})

  } else {
    $scope.loginError = msg
    $analytics.eventTrack('Login failure', {email: $scope.user.email, cause: msg})
  }
}

var finishLogin = function ($scope, $analytics, $stateParams, context) {
  $analytics.eventTrack('Login success', {provider: $scope.serviceUsed || 'password', email: $scope.user.email})
  if ($stateParams.next) {
    window.history.pushState(null, null, $stateParams.next)
  } else if (context === 'modal') {
    $scope.$close({action: 'finish'})
  } else {
    $scope.$state.go('appEntry')
  }
}

module.exports = function ($scope, $stateParams, $analytics, User, ThirdPartyAuth, context) {
  'ngInject'
  $analytics.eventTrack('Login start')
  $scope.user = {}

  $scope.submit = function (form) {
    form.submitted = true
    $scope.loginError = null
    if (form.$invalid) return

    User.login($scope.user).$promise.then(function () {
      finishLogin($scope, $analytics, $stateParams, context)
    }, function (err) {
      handleError(err, $scope, $analytics)
    })
  }

  $scope.useThirdPartyAuth = function (service) {
    $scope.serviceUsed = service
    $scope.authDialog = ThirdPartyAuth.openPopup(service)
  }

  $scope.finishThirdPartyAuth = function (error) {
    $scope.authDialog.close()
    $scope.$apply(function () {
      if (error) {
        handleError({data: error}, $scope, $analytics)
      } else {
        finishLogin($scope, $analytics, $stateParams, context)
      }
    })
  }

  $scope.go = function (state) {
    if (context === 'modal') {
      $scope.$close({action: 'go', state: state})
    } else {
      $scope.$state.go(state)
    }
  }
}
