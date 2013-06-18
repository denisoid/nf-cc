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

function CarConfigurationCtrl($scope, $filter, LoanProducts, Packaging_LoanProduct, Products, Packagings, Marks, Models, CarConfiguration) {

    //init

    $scope.markList = Marks.query({}, function () {
        $scope.updateMark();
    });
    $scope.selMarkList = [];
    $scope.modelList = Models.query();
    $scope.selModelList = [];
    $scope.packagingList = Packagings.query();
    $scope.selPackagingList = [];
    //$scope.yearList = Years.query();
    $scope.selYearList = [
        {year: 2013},
        {year: 2012},
        {year: 2011},
        {year: 2010},
        {year: 2009},
        {year: 2008},
        {year: 2007},
        {year: 2006},
        {year: 2005}
    ];


    $scope.car = CarConfiguration;

    $scope.updateMark = function () {
        $scope.selMarkList = $filter('filter')($scope.markList, function (element) {
            return element.used == $scope.car.used;
        });
        $scope.car.markId = undefined;
        $scope.updateModel();
    }

    $scope.updateModel = function () {
        $scope.selModelList = $filter('filter')($scope.modelList, function (element) {
            return element.markId == $scope.car.markId;
        });
        $scope.car.modelId = undefined;
        $scope.updatePackaging();
    }

    $scope.updatePackaging = function () {
        $scope.selPackagingList = $filter('filter')($scope.packagingList, function (element) {
            return element.modelId == $scope.car.modelId;
        });
        $scope.car.packagingId = undefined;
        $scope.updateYear();
    }

    $scope.updateYear = function () {
    }

    $scope.updateCarForPackaging = function () {
        var searchedId = $scope.car.packagingId;
        if (searchedId == undefined) {
            return;
        }
        var packaging = undefined;
        for (var ti = 0, len = $scope.selPackagingList.length; ti < len; ti++) {
            var pack = $scope.selPackagingList[ti];
            if (pack.id == searchedId) {
                packaging = pack;
                break;
            }
        }
        if (packaging == undefined) {
            $scope.car.price = undefined;
            $scope.car.discount = undefined;
        } else {
            $scope.car.price = packaging.cost;
            $scope.car.discount = packaging.discount;
        }
    }

    $scope.$watch('car.packagingId', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.updateCarForPackaging();
    });
}

function LoanProgramSelectionCtrl($scope, LoanProducts, Packaging_LoanProduct, CarConfiguration, $filter, $timeout) {

    $scope.car = CarConfiguration;

    $scope.loanProductList = LoanProducts.query();
    $scope.loanProductForPackList = $scope.loanProductList;
    $scope.loanProductForCriteriaList = [];
    $scope.packaging_loanProductList = Packaging_LoanProduct.query();

    $scope.initialPayment = 0;
    $scope.initialPaymentPercent = 0;

    $scope.months = 12;

    $scope.currentOfferList = [];

    $scope.selectedOfferList = [];


    $scope.addToSelectedOfferList = function (idx) {
        var foundIdx = $.inArray($scope.currentOfferList[idx], $scope.selectedOfferList);
        if (foundIdx == -1) {
            $scope.selectedOfferList.push($scope.currentOfferList[idx]);
            $scope.sortSelectedOfferList();
        }// else if()
    }

    $scope.sortSelectedOfferList = function () {
        $scope.selectedOfferList = $filter('orderBy')($scope.selectedOfferList, 'overPayment');
    }

    $scope.removeFromSelectedOfferList = function (idx) {
        $scope.selectedOfferList.splice(idx, 1);
    }

    $scope.resetOffers = function () {
        $scope.loanProductForPackList = [];
        $scope.loanProductForCriteriaList = [];
        $scope.currentOfferList = [];
    };

    $scope.$watch('car.packagingId', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        //$scope.resetOffers();
        $scope.filterLoanProductListForPack();
        $scope.resetTimerForUdateOffers();
    });

    $scope.resetTimerForUdateOffers = function () {
        if ($scope.timerForUpdateOffers) {
            $timeout.cancel($scope.timerForUpdateOffers);
        }
        $scope.timerForUpdateOffers = $timeout(
            function () {
                $scope.filterLoanProductListForCriteria();
                $scope.updateCurrentOfferList();
            }
            , 100);
    }

    $scope.$watch('car.price', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.initialPaymentPercent = Math.round($scope.initialPayment * 100 / $scope.car.price);
        $scope.resetTimerForUdateOffers();
    });

    $scope.$watch('initialPayment', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.initialPaymentPercent = Math.round($scope.initialPayment * 100 / $scope.car.price);
        $scope.resetTimerForUdateOffers();
    });

    $scope.$watch('months', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.resetTimerForUdateOffers();
    })

    $scope.filterLoanProductListForPack = function () {

        if ($scope.car.packagingId == undefined) {
            $scope.loanProductForPackList = $scope.loanProductList;
            return;
        }

        var filteredProductList = [];

        for (var ti = 0, len = $scope.packaging_loanProductList.length; ti < len; ti++) {
            var packId = $scope.packaging_loanProductList[ti].packId;
            if ($scope.car.packagingId == packId) {
                filteredProductList.push($scope.packaging_loanProductList[ti].productId);
            }
        }

        $scope.loanProductForPackList = $filter('filter')($scope.loanProductList, function (element) {
                for (var tj = 0, len = filteredProductList.length; tj < len; tj++) {
                    var productId = filteredProductList[tj];
                    if (element.id == productId) {
                        return true;
                    }
                }
                return false;
            }
        );
    }

    $scope.filterLoanProductListForCriteria = function () {
        $scope.loanProductForCriteriaList = $filter('filter')($scope.loanProductForPackList, function (element) {
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
    }

    $scope.updateCurrentOfferList = function () {
        $scope.currentOfferList = [];
        for (var i = 0, len = $scope.loanProductForCriteriaList.length; i < len; i++) {
            var product = $scope.loanProductForCriteriaList[i];
            var creditValue = $scope.car.price - $scope.initialPayment;
            var overPayment = Math.round(creditValue * product.rate * $scope.months / 1200);
            var returnValue = (creditValue + overPayment);
            var monthPayment = Math.round(returnValue / $scope.months);
            var offer = {
                id: product.id,
                name: product.name,
                price: $scope.car.price,
                initialPayment: $scope.initialPayment,
                creditValue: creditValue,
                months: $scope.months,
                monthPayment: monthPayment,
                overPayment: overPayment,
                returnValue: returnValue,
                rate: product.rate,
                servicePrice: 125000
            };
            $scope.currentOfferList.push(offer);
        }
    }
}

function OfferCtrl($scope, CarConfiguration, $filter) {
    $scope.serviceList = [
        {"id": "1", "selected": false, mandatory: false, "name": "Расш. гарантия", "ctype": "fixed", "cost": "3000"},
        {"id": "2", "selected": false, mandatory: false, "name": "Помощь на дорогах", "ctype": "fixed", "cost": "3000"},
        {"id": "3", "selected": false, mandatory: false, "name": "Защита кредита", "ctype": "fixed", "cost": "125000"},
        {"id": "4", "selected": false, mandatory: false, "name": "ДСАГО", "ctype": "input", "cost": "125000"},
        {"id": "5", "selected": true, mandatory: true, "name": "КАСКО", "ctype": "input", "cost": "125000"}
    ];

    $scope.updateOffer = function () {
        var offer = $scope.offer;
        var price = 0;
        for (var ti = 0, len = $scope.serviceList.length; ti < len; ti++) {
            var service = $scope.serviceList[ti];
            if (service.selected == true) {
                var cost = parseFloat(service.cost)
                if (!isNaN(cost)) {
                    price = price + cost;
                }
            }
        }
        offer.servicePrice = price;

        offer.creditValue = offer.price - offer.initialPayment + offer.servicePrice;
        offer.overPayment = Math.round(offer.creditValue * offer.rate * offer.months / 1200);
        offer.returnValue = (offer.creditValue + offer.overPayment);
        offer.monthPayment = Math.round(offer.returnValue / offer.months);
    };

}
