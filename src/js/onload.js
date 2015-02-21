hyloEnv.onUser(function(user) {

  // segment
  analytics.identify(user.id, {
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    name: user.name,
    provider: user.linkedAccounts[0].provider_key,
    created: user.date_created,
    createdAt: user.date_created
  }, {
    integrations: {
      Intercom: {
        user_hash: '<%= OpenSSL::HMAC.hexdigest("sha256", "fwnUBkiU2spjAlzNPDNCJhoI4iBQ66ap6XOnTznL", user.id) %>'
      }
    }
  });

  // rollbar
  _rollbarConfig.payload.person = {
    id: user.id,
    username: user.name,
    email: user.email
  };

});

// Zopim
if (hyloEnv.isProd) {
  var ua = navigator.userAgent.toLowerCase(),
  platform = navigator.platform.toLowerCase();
  platformName = ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0],
  isMobile = /ios|android|webos/.test(platformName);
  if (!isMobile) {
    window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
    d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
    _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute('charset','utf-8');
    $.src='//v2.zopim.com/?1xg3kCDzmdR6YP4N2pijAkN8yitxHFrJ';z.t=+new Date;$.
    type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');

    hyloEnv.onUser(function(user) {
      $zopim(function() {
        $zopim.livechat.setName(user.name);
        $zopim.livechat.setEmail(user.email);
      });
    });
  }
}

window.fbAsyncInit = function() {
  FB.init({appId: hyloEnv.fb.appId, xfbml: true, version: 'v2.1'});
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Prevents backspace except in the case of textareas and text inputs to prevent user navigation.
$(document).keydown(function (e) {
  var preventKeyPress;
  if (e.keyCode == 8) {
    var d = e.srcElement || e.target;
    switch (d.tagName.toUpperCase()) {
      case 'TEXTAREA':
        preventKeyPress = d.readOnly || d.disabled;
        break;
      case 'INPUT':
        preventKeyPress = d.readOnly || d.disabled ||
        (d.attributes["type"] && $.inArray(d.attributes["type"].value.toLowerCase(), ["radio", "checkbox", "submit", "button"]) >= 0);
        break;
      case 'DIV':
        preventKeyPress = d.readOnly || d.disabled || !(d.attributes["contentEditable"] && d.attributes["contentEditable"].value == "true");
        break;
      default:
        preventKeyPress = true;
        break;
    }
  }
  else
    preventKeyPress = false;

  if (preventKeyPress) {
    console.log("preventing backspace");
    e.preventDefault();
  }
});
