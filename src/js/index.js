require('./onload');

/* Bower Components */
require('angular-animate');
require('angular-growl');
require('angular-http-auth');
require('angular-route');
require('angular-resource');
require('angular-sanitize');
require('angular-touch');
require('angular-ui-router');
require('angulartics');
require('filepicker');
require('gsap/src/uncompressed/TweenLite');
require('gsap/src/uncompressed/plugins/CSSPlugin');
// require('gsap/src/uncompressed/easing/EasePack');
require('ment.io');
require('newrelic-timing');
require('newrelic-timing/newrelic-timing-angular');
require('ng-idle');
require('ngInfiniteScroll');
/* End Bower Components */

/* Manually installed components */
require('./angular/angular-tags-0.2.10-tpls');
require('./angular/ui-bootstrap-tpls-0.12.0-enhanced');
require('./angular/angulartics-segmentio');

require('./app/hyloApp');

filepicker.setKey(hyloEnv.filepicker.key);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['hyloApp'], {strictDi: true});
});
