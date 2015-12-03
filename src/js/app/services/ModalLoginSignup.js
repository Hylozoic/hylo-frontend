/*

usage:

ModalLoginSignup.start({
  resolve: {
    // any extra resolve dependencies to pass to the signup/login controllers
  },
  finish: function () {
    // what to do after login/signup is successful
  }
})

*/

module.exports = function ($modal) {
  'ngInject'
  return {
    start: function (options) {
      start($modal, options)
    }
  }
}

function start ($modal, options) {
  var modalDefaults = {
    backdrop: true,
    keyboard: false,
    windowClass: 'login-signup-modal',
    resolve: _.merge({
      context: () => 'modal',
      projectInvitation: () => null
    }, options.resolve)
  }

  var open = function (state) {
    var modalOptions = {}

    if (state === 'signup') {
      _.merge(modalOptions, {
        templateUrl: '/ui/entrance/signup.tpl.html',
        controller: 'SignupCtrl'
      }, modalDefaults)
    } else if (state === 'login') {
      _.merge(modalOptions, {
        templateUrl: '/ui/entrance/login.tpl.html',
        controller: 'LoginCtrl'
      }, modalDefaults)
    } else if (state === 'forgotPassword') {
      _.merge(modalOptions, {
        templateUrl: '/ui/entrance/forgot-password.tpl.html',
        controller: 'ForgotPasswordCtrl'
      }, modalDefaults)
    }

    $modal.open(modalOptions).result.then(handle)
  }

  var handle = function (result) {
    if (result.action === 'go') {
      // toggling between login, signup, forgot password within the modal
      open(result.state)
    } else if (result.action === 'finish') {
      options.finish()
    }
  }

  open('signup')
}
