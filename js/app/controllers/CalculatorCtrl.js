'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:03
 */
function CalculatorCtrl($scope, CalculatorData) {
    $scope.data = CalculatorData;
    $scope.isMaxPaymentShow = false;

    $scope.client = {maxMonthPayment: 100000, maxCreditValue: 1000000};

    $scope.isCatalog = true;
    $scope.carPrice = 1000000;
    $scope.data.calculationList = [];

    $scope.delCalculation = function (ind) {
        $scope.data.delCalculation(ind);
    }

    $scope.restoreCalculation = function (ind) {
        $scope.data.restoreCalculation(ind);
    }

    $scope.saveCalculation = function () {
        $scope.data.saveCalculation();
    }

}

