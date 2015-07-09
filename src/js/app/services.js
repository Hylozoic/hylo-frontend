module.exports = function(angularModule) {

  // resources
  require('./services/User')(angularModule);
  require('./services/Community')(angularModule);
  require('./services/Activity')(angularModule);
  require('./services/Comment')(angularModule);
  require('./services/Search')(angularModule);
  require('./services/Post')(angularModule);
  require('./services/Invitation')(angularModule);
  require('./services/Project')(angularModule);
  require('./services/Network')(angularModule);

  // other services
  require('./services/bodyClass')(angularModule);
  require('./services/onboarding')(angularModule);
  require('./services/clickthroughTracker')(angularModule);
  require('./services/history')(angularModule);
  require('./services/dialog')(angularModule);
  require('./services/Cache')(angularModule);
  require('./services/UserCache')(angularModule);
  require('./services/ThirdPartyAuth')(angularModule);
  require('./services/PostManager')(angularModule);
  require('./services/removeTrailingSlash')(angularModule);
  require('./services/myHttpInterceptor')(angularModule);
  require('./services/popupDone');

  angularModule.factory('CurrentUser',  require('./services/CurrentUser'));
  angularModule.factory('Meta',         require('./services/Meta'));
  angularModule.factory('UserMentions', require('./services/UserMentions'));

};
