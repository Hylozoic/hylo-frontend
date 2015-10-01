require('traceur/bin/traceur-runtime');

// because i use this so damn often, let's just make it a global.
// at least until we get ES6 template strings up in here
window.format = require('util').format;
window.io = require('./sails.io')(require('socket.io-client/socket.io'));
io.sails.autoConnect = false;

require('./onload');

// Bower components
require('afkl-lazy-image');
require('angular-animate');
require('angular-growl');
require('angular-resource');
require('angular-sanitize');
require('angular-touch');
require('angular-ui-bootstrap-bower/ui-bootstrap');
require('angular-ui-bootstrap-bower/ui-bootstrap-tpls');
require('angular-ui-router');
require('angulartics');
require('bootstrap-ui-datetime-picker/dist/datetime-picker');
require('gsap/src/uncompressed/TweenLite');
require('gsap/src/uncompressed/plugins/CSSPlugin');
// require('gsap/src/uncompressed/easing/EasePack');
require('ment.io');
require('newrelic-timing');
require('newrelic-timing/newrelic-timing-angular');
require('ng-tags-input');
require('ngInfiniteScroll');

// Manually-installed components
require('./angular/angulartics-segmentio');

require('./app/index');

if (hyloEnv.environment !== 'test') {
  angular.element(document).ready(function() {
    angular.bootstrap(document.getElementsByTagName('html')[0], ['hyloApp'], {strictDi: true});
  });
}
