'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:05
 */
function LoanProgramSelectionCtrl($scope, CalculatorData, ClientData, LoanProducts, Packaging_LoanProduct, ServiceGroups, $filter, $timeout) {
    $scope.data = CalculatorData;
    $scope.client = ClientData;

    //init services
    $scope.data.calculation.offer.services.grouplist = ServiceGroups.query({}, function () {
        $scope.data.calculation.offer.services.init();
        $scope.data.calculation.offer.services.calculateSum();
    });

    var parameters = $scope.data.calculation.parameters;
    var car = $scope.data.calculation.car;
    $scope.initialPaymentPercent = 0;
    if(car.pack) {
        $scope.initialPaymentPercent = Math.round(100*parameters.initialPayment / car.pack.price);
    }

    parameters.monthPaymentFilter = $scope.client.maxMonthPayment;

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
        $scope.data.calculation.car.dealerDiscount = 0;
    }

    $scope.resetOffers = function () {
        $scope.loanProductForPackList = [];
        $scope.loanProductForCriteriaList = [];
        $scope.currentOfferList = [];
    };

    $scope.filterLoanProductListForPack = function () {

        if ($scope.data.calculation.car.pack == null) {
            $scope.loanProductForPackList = $scope.loanProductList;
            return;
        }

        var filteredProductList = [];

        for (var ti = 0, len = $scope.packaging_loanProductList.length; ti < len; ti++) {
            var packId = $scope.packaging_loanProductList[ti].packId;
            if ($scope.data.calculation.car.pack.id == packId) {
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
        if($scope.data.calculation.car.pack == null) {
            $scope.loanProductForCriteriaList = [];
            return;
        }
        var initialPaymentPercent = Math.round(100 * $scope.data.calculation.parameters.initialPayment / $scope.data.calculation.car.pack.price);
        $scope.loanProductForCriteriaList = $filter('filter')($scope.loanProductForPackList, function (element) {
                if (
                    (initialPaymentPercent >= element.minip) &&
                        (initialPaymentPercent <= element.maxip) && true /*
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
        var car = $scope.data.calculation.car;
        if(car.pack == null) {
            $scope.data.resetOffer();
            return;
        }
        var parameters = $scope.data.calculation.parameters;

        for (var i = 0, len = $scope.loanProductForCriteriaList.length; i < len; i++) {
            var monthPaymentFilter = parameters.monthPaymentFilter;
            if(isNaN(monthPaymentFilter) || (monthPaymentFilter == null) || monthPaymentFilter == 0) {
                break;
            }

            var discount = parseFloat(car.pack.discount);
            if (isNaN(discount)) discount = 0;
            var price = car.pack.price;
            var product = $scope.loanProductForCriteriaList[i];
            var initialPayment = parameters.initialPayment;
            var dealerDiscount = parseFloat(car.dealerDiscount);
            if (isNaN(dealerDiscount)) dealerDiscount = 0;
            var tradeIn = parameters.tradeIn;
            var refinance = parameters.refinance;
            var lastpayment = parameters.lastPayment;
            var carCreditValue = price - initialPayment - discount - dealerDiscount - tradeIn + refinance - lastpayment;
            var services = $scope.data.calculation.offer.services;
            var serviceDiscount = services.discount;
            var serviceValue = services.sum - serviceDiscount;
            var creditValue = carCreditValue;

            if(creditValue <= 0 || monthPaymentFilter >= creditValue) {
                break;
            }

            var months = Math.ceil((creditValue * (1 + (product.rate/100)))/monthPaymentFilter);

            if(product.minterm > months || product.maxterm < months) {
                continue;
            }

            var overPayment = (creditValue * product.rate * months / 1200);
            var returnValue = (creditValue + overPayment);
            var monthPayment = (returnValue + serviceValue) / months;
            var carMonthPayment = ((carCreditValue + (carCreditValue * product.rate * months / 1200)) / months);
            var serviceMonthPayment = (serviceValue / months);
            var offer = {
                id: "" + i,
                product: product,
                price: price,
                creditValue: creditValue,
                months: months,
                monthPayment: monthPayment,
                overPayment: overPayment,
                returnValue: returnValue,
                serviceValue: serviceValue,
                serviceDiscount: serviceDiscount,
                discount: discount,
                dealerDiscount: dealerDiscount,
                carMonthPayment: carMonthPayment,
                serviceMonthPayment: serviceMonthPayment
            };
            $scope.currentOfferList.push(offer);
        }

        $scope.currentOfferList = $filter('filter')($scope.currentOfferList, function(element) {
            if($scope.client.maxMonthPayment < element.monthPayment)  {
                return false;
            }
            if($scope.client.maxCreditValue < element.creditValue)  {
                return false;
            }
            return true;

        });

        $scope.currentOfferList = $filter('orderBy')($scope.currentOfferList, 'overPayment');
        $scope.currentOfferListPage.setup($scope.currentOfferList);
        if($scope.currentOfferList.length > 0) {
            if($scope.data.calculation.offerIndex < $scope.currentOfferList.length) {
                $scope.setCurrentOffer($scope.data.calculation.offerIndex);
            } else {
                $scope.setCurrentOffer(0);
            }
        } else {
            $scope.data.resetOffer();
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
        $scope.data.calculation.offerIndex = idx;
        var copy = $scope.currentOfferListPage.currentPage[idx];
        var offer = $scope.data.calculation.offer;
        offer.product = copy.product;
        offer.creditValue = copy.creditValue;
        offer.months = copy.months;
        offer.monthPayment = copy.monthPayment;
        offer.overPayment = copy.overPayment;
        offer.returnValue = copy.returnValue;
        offer.serviceValue = copy.serviceValue;
        offer.serviceDiscount = copy.serviceDiscount;
        offer.carMonthPayment = copy.carMonthPayment;
        offer.serviceMonthPayment = copy.serviceMonthPayment;
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

    $scope.isServiceGroupSelected = function (group) {
        if(group.selected.name != "") return true;
        return false;
    }


    $scope.$watch('data.calculation.parameters.initialPayment', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.initialPaymentPercent = Math.round(100*$scope.data.calculation.parameters.initialPayment / $scope.data.calculation.car.pack.price);
        $scope.resetTimerForUpdateOffers();
    });


    $scope.$watch('data.calculation.parameters.monthPaymentFilter', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.resetTimerForUpdateOffers();
    })

    $scope.$watch('data.calculation.car.pack', function (newVal, oldVal) {
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

    $scope.$watch('data.calculation.offerIndex', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.setCurrentOffer(newVal);
    });

    $scope.$watch('client.maxMonthPayment', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.data.calculation.parameters.monthPaymentFilter = $scope.client.maxMonthPayment;
        $scope.updateFilters();
        $scope.filterLoanProductListForPack();
        $scope.resetTimerForUpdateOffers();
    });

    $scope.$watch('data.calculation.offer.services.sum', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.resetTimerForUpdateOffers();
    });

    $scope.$watch('data.calculation.parameters.tradeIn', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.resetTimerForUpdateOffers();
    });

    $scope.$watch('data.calculation.parameters.refinance', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.resetTimerForUpdateOffers();
    });
}

