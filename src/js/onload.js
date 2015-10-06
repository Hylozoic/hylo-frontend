window.hyloEnv.onUser(function (user) {
  if (!user) {
    // Intercom only initializes after a call to #identify:
    // https://segment.com/docs/integrations/intercom/
    //
    // but this isn't the right approach yet, because then we end up
    // with one person's activity split across two users (pre- and post-login).
    // i'm waiting for a response from Intercom support about this.
    //
    // analytics.identify(uuid.v4())
    return
  }

  var membership = user.lastUsedMembership()
  var account = user.linkedAccounts[0]

  // segment
  window.analytics.identify(user.id, {
    email: user.email,
    name: user.name,
    provider: account && account.provider_key,
    createdAt: user.created_at,
    community_name: membership && membership.community.name,
    community_id: membership && membership.community.id,
    post_count: user.post_count
  })

  // rollbar
  window._rollbarConfig.payload.person = {
    id: user.id,
    username: user.name,
    email: user.email
  }
})

window.fbAsyncInit = function () {
  window.FB.init({appId: window.hyloEnv.fb.appId, xfbml: true, version: 'v2.1'})
}

;(function (d, s, id) {
  var js
  var fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) return
  js = d.createElement(s); js.id = id
  js.src = '//connect.facebook.net/en_US/sdk.js'
  fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'facebook-jssdk'))

// Prevents backspace except in the case of textareas and text inputs to prevent user navigation.
document.addEventListener('keydown', function (e) {
  var preventKeyPress = false

  if (e.keyCode === 8) {
    var d = e.srcElement || e.target
    switch (d.tagName.toUpperCase()) {
      case 'TEXTAREA':
        preventKeyPress = d.readOnly || d.disabled
        break
      case 'INPUT':
        preventKeyPress = d.readOnly || d.disabled ||
          (d.attributes.type && _.contains(['radio', 'checkbox', 'submit', 'button'], d.attributes.type.value.toLowerCase()))
        break
      case 'DIV':
        preventKeyPress = d.readOnly || d.disabled || !(d.attributes.contentEditable && d.attributes.contentEditable.value === 'true')
        break
      default:
        preventKeyPress = true
        break
    }
  }

  if (preventKeyPress) e.preventDefault()
})
