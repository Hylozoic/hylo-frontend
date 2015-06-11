// because i use this so damn often, let's just make it a global.
// at least until we get ES6 template strings up in here
window.format = require('util').format;

require('./onload');

/* Bower Components */
require('angular-animate');
require('angular-growl');
require('angular-resource');
require('angular-sanitize');
require('angular-touch');
require('angular-ui-bootstrap-bower/ui-bootstrap');
require('angular-ui-bootstrap-bower/ui-bootstrap-tpls');
require('angular-ui-router');
require('angulartics');
require('filepicker.io/filepicker.min');
require('gsap/src/uncompressed/TweenLite');
require('gsap/src/uncompressed/plugins/CSSPlugin');
// require('gsap/src/uncompressed/easing/EasePack');
require('ment.io');
require('newrelic-timing');
require('newrelic-timing/newrelic-timing-angular');
require('ng-idle');
require('ng-tags-input');
require('ngInfiniteScroll');
/* End Bower Components */

/* Manually installed components */
require('./angular/angulartics-segmentio');

require('./app/index');

filepicker.setKey(hyloEnv.filepicker.key);

if (hyloEnv.environment != 'test') {
  angular.element(document).ready(function() {
    angular.bootstrap(document.body, ['hyloApp'], {strictDi: true});
  });
}
