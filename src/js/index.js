$ = jQuery = require('jquery');
_          = require('lodash');
moment     = require('moment');

require('./onload');

/* Bower Components */
require('angular');
require('angular-animate');
require('angular-bootstrap-select');
require('angular-growl');
require('angular-http-auth');
require('angular-route');
require('angular-resource');
require('angular-sanitize');
require('angular-touch');
require('angular-ui-router');
require('angulartics');
require('bootstrap-select');
require('filepicker');
require('newrelic-timing');
require('newrelic-timing/newrelic-timing-angular');
require('ng-idle');
require('ngInfiniteScroll');
require('ment.io');
require('gsap/src/uncompressed/TweenLite');
require('gsap/src/uncompressed/plugins/CSSPlugin');
// require('gsap/src/uncompressed/easing/EasePack');
/* End Bower Components */

/* Manually installed components */
require('./angular/angular-tags-0.2.10-tpls');
require('./angular/ui-bootstrap-tpls-0.12.0-enhanced');
require('./angular/angulartics-segmentio');
require('./jquery/draggable-background');

require('./app/hyloApp');

filepicker.setKey(hyloEnv.filepicker.key);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['hyloApp'], {strictDi: true});
});
