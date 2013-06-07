'use strict';

/* Controllers */

function FlipCtrl($scope) {
    $scope.isFlip = false;
    $scope.flip = function () {
        $scope.isFlip = !$scope.isFlip;
    }
}

function CalculatorCtrl($scope, CarConfiguration) {

    $scope.car = CarConfiguration;

}

function CarConfigurationCtrl($scope, CarConfiguration, CarCompanys, CarModels, CarModifs, CarYears) {
    $scope.car = CarConfiguration;

    $scope.carCompanyList = CarCompanys;
    $scope.carModelList = CarModels;
    $scope.carModifList = CarModifs;
    $scope.carYearList = CarYears;

    $scope.updateCompany = function () {
        $scope.car.modelId = "";
        $scope.updateModel();
    }

    $scope.updateModel = function () {
        $scope.car.modifId = "";
        $scope.updateModif();
    }

    $scope.updateModif = function () {
        $scope.car.yearId = "";
        $scope.updateYear();
    }

    $scope.updateYear = function () {
    }

}

function LoanProgramSelectionCtrl($scope, LoanProducts, CarConfiguration, $filter) {

    $scope.car = CarConfiguration;

    $scope.loanProductList = [];

    $scope.initialPayment = 0;
    $scope.initialPaymentPercent = 0;


    $scope.months = 12;

    $scope.currentOfferList = [];

    $scope.selectedOfferList = [];


    $scope.addToSelectedOfferList = function (idx) {
        $scope.selectedOfferList.push($scope.currentOfferList[idx]);
    }

    $scope.removeFromSelectedOfferList = function (idx) {
        $scope.selectedOfferList.splice(idx, 1);
    }

    $scope.isSelected = function () {
        return ($scope.selectedOfferList.length > 0);
    }

    $scope.updateLoanProductList = function () {
        $scope.loanProductList = $filter('filter')(LoanProducts, function (element) {
                if (
                    ($scope.initialPaymentPercent >= element.minip) &&
                        ($scope.initialPaymentPercent <= element.maxip) &&
                        ($scope.months >= element.minterm) &&
                        ($scope.months <= element.maxterm)
                    ) {
                    return true;
                }
                return false;
            }
        );

        $scope.currentOfferList = $scope.loanProductList;
    }

    $scope.$watch('initialPayment', function (newVal, oldVal) {
        if(newVal === oldVal) return;
        $scope.initialPaymentPercent = $scope.initialPayment/ $scope.car.price * 100;
        $scope.updateLoanProductList();
    })

    $scope.$watch('months', function (newVal, oldVal) {
        if(newVal === oldVal) return;
        $scope.updateLoanProductList();
    })
}
