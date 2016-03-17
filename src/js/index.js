
// because i use this so damn often, let's just make it a global.
// at least until we get ES6 template strings up in here
window.format = require('util').format

require('./onload')

// Bower components
require('afkl-lazy-image')
require('angular-animate')
require('angular-growl')
require('angular-resource')
require('angular-sanitize')
require('angular-touch')
require('angular-ui-bootstrap-bower/ui-bootstrap')
require('angular-ui-bootstrap-bower/ui-bootstrap-tpls')
require('angular-ui-router')
require('angulartics')
require('bootstrap-ui-datetime-picker/dist/datetime-picker')
require('gsap/src/uncompressed/TweenLite')
require('gsap/src/uncompressed/plugins/CSSPlugin')
// // require('gsap/src/uncompressed/easing/EasePack')
require('ment.io')
require('ng-tags-input')
require('ngInfiniteScroll')

// Manually-installed components
require('./angular/angulartics-segmentio')

require('./app/index')

if (window.hyloEnv.environment !== 'test') {
  angular.element(document).ready(function () {
    angular.bootstrap(document.getElementsByTagName('html')[0], ['hyloApp'], {strictDi: true})
  })
}
