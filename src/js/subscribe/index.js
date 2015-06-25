require('angular-resource');

var app = angular.module('subscribeApp', ['ngResource']);

app.factory('Subscription', function($resource) {
  return $resource('/noo/subscription/:id');
});

app.controller('BaseCtrl', function($scope, Subscription) {

  var params = require('querystring').parse(location.search.replace(/^\?/, '')),
    planId, panelLabel;
  if (params.trial) {
    planId = 'basic';
    panelLabel = 'Start 30-Day Free Trial';
  } else {
    planId = 'basic-no-trial';
    panelLabel = 'Subscribe';
  }

  var handler = StripeCheckout.configure({
    key: stripePublishableKey,
    image: '//d3ngex8q79bk55.cloudfront.net/misc/hylo-logo-white-on-teal-circle.png',
    token: function(token) {
      Subscription.save({planId: planId, token: token}, function(resp) {
        $scope.success = true;
      });
    }
  });

  $scope.startStripe = function() {
    handler.open({
      name: 'Hylo',
      description: 'Basic Plan ($50/month)',
      panelLabel: panelLabel,
      allowRememberMe: false
    });
  };
});
