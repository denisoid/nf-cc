'use strict';

/* Controllers */

function CalculatorCtrl($scope, CarCompanys, CarModels, CarModifs, CarYears) {
    $scope.car = {
        price: 813670,
        casco: 0,
        osago: 0,
        companyId: undefined,
        modelId: undefined,
        modifId: undefined,
        yearId: undefined
    }

    $scope.carCompanyList = CarCompanys;
    $scope.carModelList = CarModels;
    $scope.carModifList = CarModifs;
    $scope.carYearList = CarYears;


    $scope.currentOfferList = [];

    $scope.selectedOfferList = [];

    $scope.updateOfferList = function() {
        $scope.currentOfferList = [
            {productCode: "p1"},
            {productCode: "p2"},
            {productCode: "p3"},
            {productCode: "p4"}
        ];
    }

    $scope.addToSelectedOfferList = function(idx) {
        $scope.selectedOfferList.push($scope.currentOfferList[idx]);
    }


    $scope.summ = function () {
        return parseFloat($scope.car.price) + parseFloat($scope.car.osago) + parseFloat($scope.car.casco);
    }

    $scope.updateCompany = function () {
        $scope.car.modelId = undefined;
        $scope.updateModel();
    }

    $scope.updateModel = function () {
        $scope.car.modifId = undefined;
        $scope.updateModif();
    }

    $scope.updateModif = function () {
        $scope.car.yearId = undefined;
        $scope.updateYear();
    }

    $scope.updateYear = function () {
    }

    $scope.updateOfferList();

}

