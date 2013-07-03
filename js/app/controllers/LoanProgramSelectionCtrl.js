'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:05
 */
function LoanProgramSelectionCtrl($scope, LoanProducts, Packaging_LoanProduct, $filter, $timeout) {

    $scope.car = $scope.calculation.car;

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

        if ($scope.selectedOfferList.length == 1) {
            //скрол, срабатывает после небольшой задержки, т.к. колонка не добавляется сразу почему-то
            setTimeout(function () {


                var top;
                $("table.offers-comparison:first").each(function () {
                    top = $(this).offset().top
                });

                $("body, html").stop().animate({
                    scrollTop: (top - 100) + "px"
                });

            }, 50)
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

        if ($scope.car.packagingId == null) {
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
            if (isNaN(discount)) discount = 0;
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
            var carMonthPayment = Math.round((carCreditValue + (carCreditValue * product.rate * months / 1200)) / months);
            var serviceMonthPayment = Math.round((serviceValue + (serviceValue * product.rate * months / 1200)) / months);
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

