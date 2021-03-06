'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:03
 */
function CalculatorCtrl($scope, CalculatorData, ClientData, $window) {
    $scope.data = CalculatorData;
    $scope.show = {isMaxPayment: false, isCompare:false, isMain: true};

    $scope.client = ClientData;

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

    $scope.processOffer = function () {
        var win = $window.open("front.html");
    }

    $scope.offerList = []

    $scope.toggleMaxPayment = function () {
        $scope.show.isMaxPayment = !$scope.show.isMaxPayment;
        $scope.show.isCompare = false;
        $scope.show.isMain = !$scope.show.isMaxPayment;
    }

    $scope.toggleCompare = function () {
        $scope.show.isCompare = !$scope.show.isCompare;
        $scope.show.isMaxPayment = false;
        $scope.show.isMain = !$scope.show.isCompare;
    }

    $scope.toggleMain = function () {
        $scope.show.isMain = true;
        $scope.show.isMaxPayment = false;
        $scope.show.isCompare = false;
    }
}

