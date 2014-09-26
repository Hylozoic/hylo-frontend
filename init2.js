$ = jQuery = require('jquery');
_          = require('underscore');
moment     = require('moment');

require('angular');
require('angular-animate');
require('angular-bootstrap-select');
require('angular-elastic');
require('angular-growl');
require('angular-http-auth');
require('angular-route');
require('angular-resource');
require('angular-sanitize');
require('angular-touch');
require('angular-ui-router');
require('angular-wizard');
require('angulartics');
require('bootstrap-select');
require('filepicker');
require('jquery.dotdotdot');
require('ng-idle');
require('ngInfiniteScroll');

require('./angular/angular-tags-0.2.10-tpls');
require('./angular/ui-bootstrap-tpls-0.10.0-enhanced');
require('./angular/angulartics-segmentio');
require('./jquery/guiders');
require('./jquery/draggable-background');

require('./app/auth_module');
require('./app/filters');
require('./app/directives');
require('./app/directives/hylo_post');
require('./app/directives/embeddedComments');
require('./app/directives/validateMoney');

require('./app/features/billing/billing');
require('./app/features/seeds/seeds');
require('./app/features/createCommunity');
require('./app/features/menu');
require('./app/controllers');
require('./app/controllers/community_users');
require('./app/controllers/community');
require('./app/controllers/user');
require('./app/controllers/comments');
require('./app/controllers/profile_settings');
require('./app/controllers/fulfillModal');
require('./app/controllers/onboarding');
require('./app/controllers/search');
require('./app/controllers/view_post');
require('./app/routes');
require('./app/services');

require('./app/hyloApp');

// FIXME: the code that depends upon the existence of this global
// should be rewritten
window.guiders = $.guiders;

angular.element(document).ready(function() {
  angular.bootstrap(document, ['hyloApp']);
});
