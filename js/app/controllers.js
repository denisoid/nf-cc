'use strict';

/* Controllers */

function ClientPaymentCtrl($scope) {
    $scope.maxMonthPayment =  100000;
    $scope.maxCreditValue  = 1000000;
}

function FlipCtrl($scope) {
    $scope.isFlip = false;
    $scope.flip = function () {
        $scope.isFlip = !$scope.isFlip;
    }
}

function CalculatorCtrl($scope, CarConfiguration) {

    $scope.isCatalog = true;
    $scope.carPrice = 1000000;
    $scope.calculationList = [];
    $scope.car = CarConfiguration[0];

    $scope.addCalculation = function() {
        $scope.calculationList.push({
            car: {
                used: false,
                price: undefined,
                discount: undefined,
                markId: undefined,
                modelId: undefined,
                packagingId: undefined,
                yearId: undefined
            }
        });
    }

    $scope.copyCalculation = function(ind) {

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
        $scope.calculation = $scope.calculationList[$scope.calculationList.length-1];
    }

    $scope.delCalculation = function(ind) {
        $scope.calculationList.splice(ind);
    }

    $scope.addCalculation();

    $scope.calculation = $scope.calculationList[0];
}

function CarSearchCtrl($scope, CarConfiguration) {
    $scope.selCars = [{carId:"1"}]
}

function CarConfigurationCtrl($scope, $filter, LoanProducts, Packaging_LoanProduct, Products, Packagings, Marks, Models, CarConfiguration, $timeout) {

    //init
    $scope.selMarkList = [];
    $scope.selModelList = [];
    $scope.selPackagingList = [];

    $scope.car = CarConfiguration;

    $scope.markList = Marks.query({}, function () {
        $scope.updateMark();
    });
    $scope.modelList = Models.query({}, function () {
        $scope.updateModel();
    });
    $scope.packagingList = Packagings.query({}, function () {
        $scope.updatePackaging();
    });

    //$scope.yearList = Years.query();
    $scope.selYearList = [];
    var currentYear = (new Date()).getFullYear();
    for(var ti = currentYear; ti > currentYear-20; ti--) {
        $scope.selYearList.push({"yearId": ti});
    }

    $scope.car.yearId = currentYear;

    $scope.updateMark = function () {
        if($scope.markList.length == 0) return;
        $scope.selMarkList = $filter('filter')($scope.markList, function (element) {
            return element.used == $scope.car.used;
        });
        if($scope.selMarkList.length > 0) {
            $scope.car.markId = $scope.selMarkList[0].id;
        } else {
            $scope.car.markId = undefined;
        }
        $scope.updateModel();
    }

    $scope.updateModel = function () {
        if($scope.modelList.length == 0) return;
        $scope.selModelList = $filter('filter')($scope.modelList, function (element) {
            return element.markId == $scope.car.markId;
        });
        if($scope.selModelList.length > 0) {
            $scope.car.modelId = $scope.selModelList[0].id;
        } else {
            $scope.car.modelId = undefined;
        }
        $scope.updatePackaging();
    }

    $scope.updatePackaging = function () {
        if($scope.packagingList.length == 0) return;
        $scope.selPackagingList = $filter('filter')($scope.packagingList, function (element) {
            return element.modelId == $scope.car.modelId;
        });
        if($scope.selPackagingList.length > 0) {
            $scope.car.packagingId = $scope.selPackagingList[0].id;
        } else {
            $scope.car.packagingId = undefined;
        }
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

    $scope.packaging_loanProductList = Packaging_LoanProduct.query({}, function () {
        $scope.filterLoanProductListForPack();
        $scope.resetTimerForUpdateOffers();
    });

    $scope.loanProductList = LoanProducts.query({}, function () {
        $scope.filterLoanProductListForPack();
        $scope.resetTimerForUpdateOffers();
    });
    $scope.loanProductForPackList = $scope.loanProductList;
    $scope.loanProductForCriteriaList = [];

    $scope.initialPayment = 200000;
    $scope.initialPaymentPercent = 0;

    $scope.months = 12;

    $scope.currentOfferList = [];

    $scope.selectedOfferList = [];


    $scope.addToSelectedOfferList = function (idx) {
        var soffer = $scope.currentOfferList[idx];

        var offer = {
            n: "" + (new Date().getTime()),
            id: soffer.id,
            name: soffer.name,
            price: $scope.car.price,
            initialPayment: soffer.initialPayment,
            creditValue: soffer.creditValue,
            months: soffer.months,
            monthPayment: soffer.monthPayment,
            overPayment: soffer.overPayment,
            returnValue: soffer.returnValue,
            rate: soffer.rate,
            serviceValue: soffer.serviceValue,
            car: jQuery.extend(true, {}, $scope.car)
        };

        $scope.selectedOfferList.push(offer);
        $scope.sortSelectedOfferList();

        if($scope.selectedOfferList.length==1){
            //скрол, срабатывает после небольшой задержки, т.к. колонка не добавляется сразу почему-то
            setTimeout(function(){



                var top;
                $("table.offers-comparison:first").each(function(){
                    top=$(this).offset().top
                });

                $("body, html").stop().animate({
                    scrollTop:(top-100)+"px"
                });

            },50)
        }

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
            var discount = parseFloat($scope.car.discount);
            if(isNaN(discount)) discount = 0;
            var months = $scope.months;
            var price = $scope.car.price;
            var product = $scope.loanProductForCriteriaList[i];
            var initialPayment = $scope.initialPayment;
            var dealerDiscount = 0;
            var serviceDiscount = 0;
            var carCreditValue = price - initialPayment - discount - dealerDiscount;
            var serviceValue = 125000 - serviceDiscount;
            var creditValue = carCreditValue + serviceValue;
            var overPayment = Math.round(creditValue * product.rate * months / 1200);
            var returnValue = (creditValue + overPayment);
            var monthPayment = Math.round(returnValue / months);
            var carMonthPayment = Math.round((carCreditValue + (carCreditValue * product.rate * months / 1200))/months);
            var serviceMonthPayment = Math.round((serviceValue + (serviceValue * product.rate * months / 1200))/months);
            var offer = {
                id: product.id,
                name: product.name,
                price: price,
                initialPayment: initialPayment,
                creditValue: creditValue,
                months: months,
                monthPayment: monthPayment,
                overPayment: overPayment,
                returnValue: returnValue,
                rate: product.rate,
                serviceValue: serviceValue,
                serviceDiscount: serviceDiscount,
                discount: discount,
                dealerDiscount: dealerDiscount,
                carMonthPayment: carMonthPayment,
                serviceMonthPayment: serviceMonthPayment
            };
            $scope.currentOfferList.push(offer);
        }

        $scope.currentOfferList = $filter('orderBy')($scope.currentOfferList, 'overPayment');
    }

    $scope.resetTimerForUpdateOffers = function () {
        if ($scope.timerForUpdateOffers) {
            $timeout.cancel($scope.timerForUpdateOffers);
        }
        $scope.timerForUpdateOffers = $timeout(
            function () {
                $timeout.cancel($scope.timerForUpdateOffers);
                $scope.filterLoanProductListForCriteria();
                $scope.updateCurrentOfferList();
            }
            , 100);

    }

    $scope.$watch('car.price', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.initialPaymentPercent = Math.round($scope.initialPayment * 100 / $scope.car.price);
        $scope.resetTimerForUpdateOffers();
    });

    $scope.$watch('initialPayment', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.initialPaymentPercent = Math.round($scope.initialPayment * 100 / $scope.car.price);
        $scope.resetTimerForUpdateOffers();
    });

    $scope.$watch('months', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.resetTimerForUpdateOffers();
    })

    $scope.$watch('car.packagingId', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        //$scope.resetOffers();
        $scope.filterLoanProductListForPack();
        $scope.resetTimerForUpdateOffers();
    });

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
        var serviceValue = 0;
        for (var ti = 0, len = $scope.serviceList.length; ti < len; ti++) {
            var service = $scope.serviceList[ti];
            if (service.selected == true) {
                var cost = parseFloat(service.cost);
                if (!isNaN(cost)) {
                    serviceValue = serviceValue + cost;
                }
            }
        }

        offer.carCreditValue = offer.price - offer.initialPayment - offer.discount - offer.dealerDiscount;
        offer.serviceValue = serviceValue - offer.serviceDiscount;
        offer.creditValue = offer.carCreditValue + offer.serviceValue;
        offer.overPayment = Math.round(offer.creditValue * offer.rate * offer.months / 1200);
        offer.returnValue = (offer.creditValue + offer.overPayment);
        offer.monthPayment = Math.round(offer.returnValue / offer.months);
        offer.carMonthPayment = Math.round((offer.carCreditValue + (offer.carCreditValue * offer.rate * offer.months / 1200))/offer.months);
        offer.serviceMonthPayment = Math.round((offer.serviceValue + (offer.serviceValue * offer.rate * offer.months / 1200))/offer.months);
    };

}
