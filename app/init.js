// This is the old RequireJS init file. @see init2.js

require.config({

  waitSeconds: 200,

  paths: {
    'underscore': 'underscore',
    'angular': 'angular/angular',
    'angular-animate': 'angular/angular-animate',
    'angular-elastic': 'angular/elastic',
    'angular-http-auth-interceptor': 'angular/http-auth-interceptor',
    'angular-route': 'angular/angular-route',
    'angular-resource': 'angular/angular-resource',
    'angular-sanitize': 'angular/angular-sanitize',
    'angular-touch': 'angular/angular-touch',
    'angular-growl': 'angular/angular-growl',
    'angular-ui-bootstrap-tpls': 'angular/ui-bootstrap-tpls-0.10.0-enhanced',
    'angular-ui-router': 'angular/angular-ui-router',
    'angular-idle': 'angular/angular-idle',
    'angular-tags': 'angular/angular-tags-0.2.10-tpls',
    'angular-wizard': 'angular/angular-wizard',
    'angulartics': 'angular/angulartics',
    'angulartics-segmentio': 'angular/angulartics-segmentio',
    'angulartics-scroll': 'angular/angulartics-scroll',
    'angular-infinite-scroll': 'angular/angular-infinite-scroll',
    'bootstrap-select': 'bootstrap-select',
    'angular-bootstrap-select': 'angular/angular-bootstrap-select',
    'jquery': 'jquery/jquery-2.1.1',
    'dotdotdot': 'jquery/jquery.dotdotdot',
    'guiders': 'jquery/guiders',
    'moment': 'moment-with-langs',
    'filepicker': 'filepicker'
  },

  optimize: "uglify2",
  uglify2: {
    output: {
      beautify: false
    },
    compress: {
      sequences: false,
      dead_code: false,
      unused: false,
      side_effects: false,
      global_defs: {
        DEBUG: false
      }
    },
    warnings: true,
    mangle: false
  },
  generateSourceMaps: true,
  preserveLicenseComments: false,

  /**
   * for libs that either do not support AMD out of the box, or
   * require some fine tuning to dependency mgmt
   */
  shim: {
    'underscore': {
      exports: '_'
    },
    'angular': {deps: ['jquery'], exports: 'angular'},
    'angular-animate': ['angular'],
    'angular-elastic': ['angular'],
    'angular-growl': ['angular'],
    'angular-resource': ['angular'],
    'angular-route': ['angular'],
    'angular-ui-router': ['angular'],
    'angular-sanitize': ['angular'],
    'angular-touch': ['angular'],
    'angular-idle': ['angular'],
    'angular-tags': ['angular'],
    'angular-wizard': ['angular'],
    'angulartics': ['angular'],
    'angulartics-segmentio': ['angulartics'],
    'angular-infinite-scroll': ['angular'],
    'angular-http-auth-interceptor': ['angular-route'],
    'angular-ui-bootstrap-tpls': ['angular'],
    'dotdotdot': ['jquery'],
    'guiders': ['jquery'],

    'features/billing/billing': ['angular'],
    'features/seeds/seeds': ['angular'],

    'bootstrap-select': ['jquery'],
    'angular-bootstrap-select': ['angular', 'bootstrap-select'],

    'app2': {
      deps: [
        'jquery',
        'underscore',
        'angular',
        'auth_module',
        'angular-route',
        'filters',
        'directives',
        'directives/hylo_post',
        'directives/embeddedComments',
        'features/billing/billing',
        'features/seeds/seeds',
        'controllers',
        'controllers/community_users',
        'controllers/community',
        'controllers/menu',
        'controllers/user',
        'controllers/comments',
        'controllers/profile_settings',
        'controllers/fulfillModal',
        'controllers/onboarding',
        'controllers/search',
        'controllers/view_post',
        'routes'
      ]
    },
    'auth_module': ['angular-http-auth-interceptor'],
    'filters': ['angular-sanitize', 'moment', 'underscore'],
    'services': ['angular-resource', 'angular-route'],

    'directives': {
      deps: [
        'angulartics',
        'angulartics-segmentio',
        'angular-bootstrap-select',
        'angular-resource',
        'angular-sanitize',
        'underscore',
        'filters',
        'jquery',
        'services',
        'angular-ui-bootstrap-tpls'],
      exports: "hyloDirectives"
    },
    'directives/hylo_post': ['directives'],
    'directives/embeddedComments': ['directives'],

    'controllers': {
      deps: [
        'angular-growl',
        'auth_module',
        'moment',
        'services',
        'angulartics', 'angulartics-segmentio',
        'angular-ui-router',
        'angular-ui-bootstrap-tpls',
        'angular-idle',
        'angular-tags',
        'angular-wizard',
        'angular-animate',
        'angular-ui-router',
        'angular-elastic',
        'angular-touch',
        'angular-sanitize',
        'angular-infinite-scroll',
        'angular-route',
        'guiders',
        'dotdotdot',
        'filepicker',
        'underscore',
        'filters',
        'directives',
        'services'
      ],
      exports: "hyloControllers"
    },
    'controllers/community_users': ['controllers'],
    'controllers/community': ['controllers'],
    'controllers/menu': ['controllers'],
    'controllers/user': ['controllers'],
    'controllers/comments': ['controllers'],
    'controllers/profile_settings': ['controllers'],
    'controllers/fulfillModal': ['controllers'],
    'controllers/onboarding': ['controllers'],
    'controllers/search': ['controllers'],
    'controllers/view_post': ['controllers'],
    'routes': ['angular-route', 'angular-ui-router', 'filters']
  }
});

require(['app2'], function() {
  angular.element(document).ready(function() {
    angular.bootstrap(document, ['hyloApp']);
  });
});
