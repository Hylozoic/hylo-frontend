hyloEnv.onUser(function(user) {

  // segment
  analytics.identify(user.id, {
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    name: user.name,
    provider: user.linkedAccounts[0].provider_key,
    created: user.date_created
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

  //intercom
  window.intercomSettings = {
    name: user.name,
    email: user.email,
    created_at: user.date_created,
    app_id: "wwelodje"
  };

(function(){
  var w=window;
  var ic=w.Intercom;
  if(typeof ic==="function"){
    ic('reattach_activator');
    ic('update',intercomSettings);
  }
  else {
    var d=document;
    var i=function() {
      i.c(arguments)
    };
    i.q=[];
    i.c=function(args) {
      i.q.push(args)
    };
    w.Intercom=i;
    function l(){
      var s=d.createElement('script');
      s.type='text/javascript';
      s.async=true;
      s.src='https://widget.intercom.io/widget/wwelodje';
      var x=d.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s,x);
    }
    if(w.attachEvent){
      w.attachEvent('onload',l);
    }
    else {
      w.addEventListener('load',l,false);
    }
  }
})()

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
