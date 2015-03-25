hyloEnv.onUser(function(user) {

  // segment
  analytics.identify(user.id, {
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    name: user.name,
    provider: user.linkedAccounts[0].provider_key,
    createdAt: user.date_created,
    created: user.date_created,
    community_name: user.memberships[0].community.name,
    community_id: user.memberships[0].community.id,
  });

  // rollbar
  _rollbarConfig.payload.person = {
    id: user.id,
    username: user.name,
    email: user.email
  };
});


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
document.addEventListener('keydown', function (e) {
  var preventKeyPress = false;

  if (e.keyCode == 8) {
    var d = e.srcElement || e.target;
    switch (d.tagName.toUpperCase()) {
      case 'TEXTAREA':
        preventKeyPress = d.readOnly || d.disabled;
        break;
      case 'INPUT':
        preventKeyPress = d.readOnly || d.disabled ||
        (d.attributes["type"] && _.contains(["radio", "checkbox", "submit", "button"], d.attributes["type"].value.toLowerCase()));
        break;
      case 'DIV':
        preventKeyPress = d.readOnly || d.disabled || !(d.attributes["contentEditable"] && d.attributes["contentEditable"].value == "true");
        break;
      default:
        preventKeyPress = true;
        break;
    }
  }

  if (preventKeyPress) e.preventDefault();
});
