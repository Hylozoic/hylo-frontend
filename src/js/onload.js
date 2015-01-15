if (!window.hyloEnv) hyloEnv = {};

var currentUser = hyloEnv.currentUser;

if (currentUser) {
  analytics.identify(currentUser.id, {
    email: currentUser.email,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    name: currentUser.name,
    provider: currentUser.provider,
    created: currentUser.created
  });
}

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

    if (currentUser) {
      $zopim(function() {
        $zopim.livechat.setName(currentUser.name);
        $zopim.livechat.setEmail(currentUser.email);
      });
    }
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