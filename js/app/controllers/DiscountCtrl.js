'use strict';

/**
 * User: ikotenko
 * Date: 06.07.13
 * Time: 11:37
 */
function DiscountCtrl($scope, CalculatorData) {
    $scope.car = CalculatorData.data.calculation;

    $scope.dealerDiscount = 0;

    $scope.applyDiscount = function() {
        $scope.car.dealerDiscount = $scope.dealerDiscount;
    }

    $scope.cancelDiscount = function() {
        $scope.car.dealerDiscount = 0;
        $scope.dealerDiscount = 0;
    }
}
