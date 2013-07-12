'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:05
 */
function LoanProgramSelectionCtrl($scope, CalculatorData, ClientData, LoanProducts, Packaging_LoanProduct, $filter, $timeout) {
    $scope.data = CalculatorData;
    $scope.client = ClientData;
    $scope.calculation = $scope.data.calculation;
    $scope.parameters = $scope.data.calculation.parameters;
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

    $scope.currentOfferList = [];
    $scope.selectedOfferList = [];
    $scope.currentOfferListPage = new ListWithPaging([], 4);

    $scope.updateFilters = function() {
        $scope.parameters.initialPaymentPercent = Math.round(($scope.parameters.initialPayment/$scope.car.pack.price) * 100);
        $scope.car.dealerDiscount = 0;
    }

    $scope.resetOffers = function () {
        $scope.loanProductForPackList = [];
        $scope.loanProductForCriteriaList = [];
        $scope.currentOfferList = [];
    };

    $scope.filterLoanProductListForPack = function () {

        if ($scope.car.pack == null) {
            $scope.loanProductForPackList = $scope.loanProductList;
            return;
        }

        var filteredProductList = [];

        for (var ti = 0, len = $scope.packaging_loanProductList.length; ti < len; ti++) {
            var packId = $scope.packaging_loanProductList[ti].packId;
            if ($scope.car.pack.id == packId) {
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
                    ($scope.parameters.initialPaymentPercent >= element.minip) &&
                        ($scope.parameters.initialPaymentPercent <= element.maxip) && true /*
                        ($scope.parameters.months >= element.minterm) &&
                        ($scope.parameters.months <= element.maxterm)*/
                    ) {
                    return true;
                }
                return false;
            }
        );
    }

    $scope.updateCurrentOfferList = function () {
        $scope.currentOfferList = [];
        if($scope.car.pack == null) return;
        for (var i = 0, len = $scope.loanProductForCriteriaList.length; i < len; i++) {
            var monthPaymentFilter = $scope.parameters.monthPaymentFilter;
            if(isNaN(monthPaymentFilter) || (monthPaymentFilter == null) || monthPaymentFilter == 0) {
                break;
            }

            var discount = parseFloat($scope.car.pack.discount);
            if (isNaN(discount)) discount = 0;
            var price = $scope.car.pack.price;
            var product = $scope.loanProductForCriteriaList[i];
            var initialPayment = $scope.parameters.initialPayment;
            var dealerDiscount = parseFloat($scope.car.dealerDiscount);
            if (isNaN(dealerDiscount)) dealerDiscount = 0;
            var serviceDiscount = parseFloat($scope.car.serviceDiscount);
            if (isNaN(serviceDiscount)) serviceDiscount = 0;
            var carCreditValue = price - initialPayment - discount - dealerDiscount;
            var serviceValue = 125000 - serviceDiscount; //TODO fix service sum
            var creditValue = carCreditValue + serviceValue;

            if(creditValue <= 0 || monthPaymentFilter >= creditValue) {
                break;
            }

            var months = Math.ceil((creditValue * (1 + (product.rate/100)))/monthPaymentFilter);

            if(product.minterm > months || product.maxterm < months) {
                continue;
            }

            var overPayment = Math.round(creditValue * product.rate * months / 1200);
            var returnValue = (creditValue + overPayment);
            var monthPayment = Math.round(returnValue / months);
            var carMonthPayment = Math.round((carCreditValue + (carCreditValue * product.rate * months / 1200)) / months);
            var serviceMonthPayment = Math.round((serviceValue + (serviceValue * product.rate * months / 1200)) / months);
            var offer = {
                id: "" + i,
                productId: product.id,
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
        $scope.currentOfferListPage.setup($scope.currentOfferList);
        if($scope.currentOfferList.length > 0) {
            $scope.data.calculation.offer = $scope.currentOfferListPage.currentPage[0];
        }

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

    $scope.setCurrentOffer = function (idx) {
        $scope.currentOfferListPage.currentIndex = idx;
        $scope.data.calculation.offer = $scope.currentOfferListPage.currentPage[idx];
    }

    $scope.updateCompare = function () {
        var length = $scope.data.calculationList.length;
        $scope.selectedOfferList = [];
        if($scope.data.calculation.offer != null) {
            $scope.selectedOfferList.push($scope.data.calculation.offer)
        }
        for(var ti = 0; ti < length; ti++) {
            var offer = $scope.data.calculationList[ti].offer;
            if(offer != null) {
                $scope.selectedOfferList.push(offer);
            }
        }
        $scope.selectedOfferList = $filter('orderBy')($scope.selectedOfferList, 'overPayment');
    }

    $scope.$watch('parameters.initialPayment', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.parameters.initialPaymentPercent = Math.round($scope.parameters.initialPayment * 100 / $scope.car.pack.price);
        $scope.resetTimerForUpdateOffers();
    });

    $scope.$watch('parameters.monthPaymentFilter', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.resetTimerForUpdateOffers();
    })

    $scope.$watch('car.pack', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.updateFilters();
        $scope.filterLoanProductListForPack();
        $scope.resetTimerForUpdateOffers();
    });

    $scope.$watch('show.isCompare', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        if(newVal) {
            $scope.updateCompare();
        }
    });

    $scope.$watch('currentOfferListPage.currentIndex', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.setCurrentOffer(newVal);
    });

    $scope.$watch('client.maxMonthPayment', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.parameters.monthPaymentFilter = $scope.client.maxMonthPayment;
        $scope.updateFilters();
        $scope.filterLoanProductListForPack();
        $scope.resetTimerForUpdateOffers();
    });
}

