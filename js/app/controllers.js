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

function CarConfigurationCtrl($scope, LoanProducts, Packaging_LoanProduct, Products, Packagings, Marks, Models, CarConfiguration, CarCompanys, CarModels, CarModifs, CarYears) {

    //init

    $scope.markList = Marks.query();
    $scope.modelList = Models.query();
    $scope.markList = Marks.query();

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
        var foundIdx = $scope.selectedOfferList.indexOf($scope.currentOfferList[idx]);
        if(foundIdx == -1) {
            $scope.selectedOfferList.push($scope.currentOfferList[idx]);
        }
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

        $scope.currentOfferList = [];
        for( var i = 0, len = $scope.loanProductList.length; i < len; i++) {
            var product = $scope.loanProductList[i];
            var creditValue = $scope.car.price - $scope.initialPayment;
            var overPayment = creditValue * product.rate * $scope.months/1200;
            var monthPayment = (creditValue + overPayment)/$scope.months;
            var offer = {
                id: product.id,
                name: product.name,
                price: $scope.car.price,
                initialPayment: $scope.initialPayment,
                creditValue: creditValue,
                months: $scope.months,
                monthPayment: monthPayment,
                overPayment: overPayment,
                rate: product.rate
            };
            $scope.currentOfferList.push(offer);
        }
    }

    $scope.$watch('car.price', function (newVal, oldVal) {
        if(newVal === oldVal) return;
        $scope.initialPaymentPercent = Math.round($scope.initialPayment * 100 / $scope.car.price);
        $scope.updateLoanProductList();
    });

    /*
    $scope.$watch('initialPaymentPercent', function (newVal, oldVal) {
        if(newVal === oldVal) return;
        $scope.initialPayment = $scope.initialPaymentPercent * $scope.car.price / 100;
        $scope.updateLoanProductList();
    });
    */

    $scope.$watch('initialPayment', function (newVal, oldVal) {
        if(newVal === oldVal) return;
        $scope.initialPaymentPercent = Math.round($scope.initialPayment * 100 / $scope.car.price);
        $scope.updateLoanProductList();
    });

    $scope.$watch('months', function (newVal, oldVal) {
        if(newVal === oldVal) return;
        $scope.updateLoanProductList();
    })
}
