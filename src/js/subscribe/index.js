require('angular-resource')

var app = angular.module('subscribeApp', ['ngResource'])

app.factory('Subscription', function ($resource) {
  return $resource('/noo/subscription/:id')
})

app.controller('BaseCtrl', function ($scope, Subscription) {
  var params = require('querystring').parse(window.location.search.replace(/^\?/, ''))
  var panelLabel = 'Start 30-Day Free Trial'
  var planId, amount

  switch (params.plan) {
    case '50x':
      planId = 'basic-no-trial'
      panelLabel = 'Subscribe'
      break
    case '50':
      planId = 'basic'
      break
    case '100':
      planId = 'hylo-basic-100'
      break
    case '150':
      planId = 'hylo-basic-150'
      break
    case '200':
      planId = 'hylo-basic-200'
      break
    case '250':
      planId = 'hylo-basic-250'
      break
    case '300':
      planId = 'hylo-basic-300'
      break
  }

  amount = parseInt(params.plan, 10)

  var handler = window.StripeCheckout.configure({
    key: window.stripePublishableKey,
    image: '//d3ngex8q79bk55.cloudfront.net/misc/hylo-logo-white-on-teal-circle.png',
    token: function (token) {
      Subscription.save({planId: planId, token: token}, function (resp) {
        $scope.success = true
      })
    }
  })

  $scope.startStripe = function () {
    handler.open({
      name: 'Hylo',
      description: 'Basic Plan ($' + amount + '/month)',
      panelLabel: panelLabel,
      allowRememberMe: false
    })
  }
})
