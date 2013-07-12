'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 15:33
 */
function MenuCtrl($scope, CalculatorData, ClientData) {
    $scope.data = CalculatorData;
    $scope.client = ClientData;

    $scope.delCalculation = function (ind) {
        $scope.data.delCalculation(ind);
    };

    $scope.restoreCalculation = function(ind) {
        $scope.data.restoreCalculation(ind);
    };

    $scope.saveCalculation = function () {
        $scope.data.saveCalculation();
    };
}
