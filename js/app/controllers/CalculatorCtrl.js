'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:03
 */
function CalculatorCtrl($scope) {
    $scope.isMaxPaymentShow = false;

    $scope.client = {maxMonthPayment: 100000, maxCreditValue: 1000000};

    $scope.isCatalog = true;
    $scope.carPrice = 1000000;
    $scope.calculationList = [];

    $scope.addCalculation = function () {
        $scope.calculationList.push({
            car: {
                used: false,
                price: null,
                discount: null,
                markId: null,
                modelId: null,
                packagingId: null,
                yearId: null,
                markName: 'mark',
                modelName: 'model'
            }
        });
    }

    $scope.copyCalculation = function (ind) {

        var cpv = $scope.calculationList[ind];
        $scope.calculationList.push({
            car: {
                used: cpv.car.used,
                price: cpv.car.price,
                discount: cpv.car.discount,
                markId: cpv.car.markId,
                modelId: cpv.car.modelId,
                packagingId: cpv.car.packagingId,
                yearId: cpv.car.yearId
            }
        });
    }

    $scope.delCalculation = function (ind) {
        $scope.calculationList.splice(ind);
    }

    $scope.restoreCalculation = function (ind) {
        $scope.calculation = $scope.calculationList[ind];
    }

    $scope.saveCalculation = function () {

        var cpv = $scope.calculation;
        $scope.calculationList.push({
            car: {
                used: cpv.car.used,
                price: cpv.car.price,
                discount: cpv.car.discount,
                markId: cpv.car.markId,
                modelId: cpv.car.modelId,
                packagingId: cpv.car.packagingId,
                yearId: cpv.car.yearId
            }
        });
    }

    $scope.calculation = {
        car: {
            used: false,
            price: 0,
            discount: 0,
            markId: null,
            modelId: null,
            packagingId: null,
            yearId: null
        }
    };
}

