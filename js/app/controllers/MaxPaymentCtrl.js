'use strict';

/**
 * Created with JetBrains WebStorm.
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:00
 * To change this template use File | Settings | File Templates.
 */
function MaxPaymentCtrl($scope, ClientData) {
    $scope.client = ClientData;
    $scope.months = 60;
    $scope.monthIncome = 0;
    $scope.additionalIncome = 0;
    $scope.additionalIncomeAssured = false;
    $scope.regionId = "1";
    $scope.creditCardLimit = 0;
    $scope.monthPayment = 0;

    $scope.calculateMaxPayment = function () {
        var minExpendLevel = 0;
        if ($scope.regionId == "1") {
            minExpendLevel = 20000;
        } else if ($scope.regionId == "2") {
            minExpendLevel = 15000;
        } else {
            minExpendLevel = 10000;
        }

        var assuredIncome = 0;
        if ($scope.additionalIncomeAssured) {
            assuredIncome = $scope.additionalIncome;
        } else {
            assuredIncome = 0.5 * $scope.additionalIncome;
        }

        $scope.client.maxMonthPayment = Math.round(($scope.monthIncome - minExpendLevel - $scope.monthPayment) + $scope.additionalIncome / 12);
        if ($scope.client.maxMonthPayment < 0) {
            $scope.client.maxMonthPayment = 0;
            $scope.client.maxCreditValue = 0;
        } else {
            $scope.client.maxCreditValue = $scope.months * $scope.client.maxMonthPayment;
        }
    }
}
