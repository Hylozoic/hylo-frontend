/*global google, gapi */

var oauthToken, appId, pickerApiLoaded

const createPicker = function (resolve, onPick) {
  if (!pickerApiLoaded || !oauthToken) return

  var view = new google.picker.View(google.picker.ViewId.DOCS)
  // https://developers.google.com/drive/web/mime-types
  view.setMimeTypes('image/png,image/jpeg,image/jpg,' +
    'text/html,text/plain,application/pdf,application/rtf,' +
    'application/vnd.google-apps.spreadsheet,' +
    'application/vnd.google-apps.document,' +
    'application/vnd.google-apps.file')

  var picker = new google.picker.PickerBuilder()
    // .enableFeature(google.picker.Feature.NAV_HIDDEN)
    .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
    .setAppId(appId)
    .setOAuthToken(oauthToken)
    .addView(view)
    .addView(new google.picker.DocsUploadView())
    .setDeveloperKey(window.hyloEnv.google.key)
    .setCallback(function (data) {
      if (data.action === window.google.picker.Action.PICKED) {
        onPick(data.docs[0])
      } else {
        console.log('Non-select action: ' + data.action)
      }
    })
    .build()

  resolve(picker)
}

const createInitMethod = function (resolve, onPick) {
  return function () {
    gapi.load('auth', {callback: function () {
      window.gapi.auth.authorize(
        {
          'client_id': window.hyloEnv.google.clientId,
          'scope': ['https://www.googleapis.com/auth/drive'],
          'immediate': false
        },
        function (authResult) {
          if (authResult && !authResult.error) {
            oauthToken = authResult.access_token
            createPicker(resolve, onPick)
          }
        }
      )
    }})

    gapi.load('picker', {callback: function () {
      pickerApiLoaded = true
      createPicker(resolve, onPick)
    }})
  }
}

const scriptTagId = 'google-api-tag'
const initMethodName = 'initGooglePicker'

const init = function ($q) {
  // options.onPick gets called with one argument, a result object,
  // when the picker takes an action.
  // https://developers.google.com/picker/docs/results
  return function (options) {
    appId = window.hyloEnv.google.clientId.split('-')[0]

    return $q(function (resolve) {
      if (document.getElementById(scriptTagId)) {
        createPicker(resolve, options.onPick)
      }

      window[initMethodName] = createInitMethod(resolve, options.onPick)

      var script = document.createElement('script')
      script.src = 'https://apis.google.com/js/api.js?onload=' + initMethodName
      script.id = scriptTagId
      document.body.appendChild(script)
    })
  }
}

var factory = function ($q) {
  return {
    init: init($q)
  }
}

module.exports = function (angularModule) {
  angularModule.factory('GooglePicker', factory)
}
