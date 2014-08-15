angular.module("hylo.billing", [])
  .controller("BillingCtrl", [ "$scope", "$window", "Billing",
    function ($scope, $window, Billing) {
      $scope.editPayment = function () {
        $scope.paymentEditing = true;
      };
      $scope.cancelPaymentEdit = function () {
        $scope.paymentEditing = false;
      };
      $scope.removePayment = function () {
        if ($window.confirm("Are you sure?")) {
          Billing.removeCreditCard().then(
            function (reply) {
              $scope.$root.currentUser.last4Cc = null;
              $scope.paymentEditing = true;
            },
            function (err) {
              alert(err.data.err || err.data);
            }
          );
        }
      };
    }
  ])
  .service("Billing", ["$http",
    function ($http) {
      this.addCreditCard = function (funding_instrument_uri, last4Cc) {
        return $http.post("/current_user/ufi",
          {
            funding_instrument_uri: funding_instrument_uri,
            last_4_cc: last4Cc
          }
        )
      };

      this.removeCreditCard = function () {
        return $http.post("/current_user/ufi?remove=true", {})
      }

    }
  ])
  .directive("editCreditCard", ["Billing",
    function (Billing) {
      return {
        restrict: "EA",
        templateUrl: "/ui/features/billing/edit_credit_card.tpl.html",
        replace: true,
        scope: {
          onCancel: "&",
          onSuccess: "&"
        },
        controller: function ($scope, $element) {
          if (!balanced && console) {
            console.warn("Balanced library was not loaded");
          }
          $scope.submit = function (card) {
            $scope.busy = true;
            $scope.errors = false;
            balanced.card.create(card, function (response) {
              if (response.status_code === 201) {
                var fundingInstrument = response.cards != null ? response.cards[0] : response.bank_accounts[0];
                $scope.$apply(function () {

                  Billing.addCreditCard(fundingInstrument.href, card.number.substr(-4)).then(
                    function (reply) {
                      $scope.busy = false;
                      $scope.$root.currentUser.last4Cc = card.number.substr(-4);
                      $scope.onSuccess();
                    },
                    function (error) {
                      $scope.busy = false;
                      $scope.errors = [
                        { description: (error.data.err || error.data) }
                      ];
                    }
                  );
                });
              } else {
                $scope.busy = false;
                $scope.errors = response.errors;
              }
            });
          }
        }
      }
    }
  ])