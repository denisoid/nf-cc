'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:05
 */
function OfferCtrl($scope, $filter, CalculatorData) {
    $scope.offer = CalculatorData.calculation.offer;

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
        offer.carMonthPayment = Math.round((offer.carCreditValue + (offer.carCreditValue * offer.rate * offer.months / 1200)) / offer.months);
        offer.serviceMonthPayment = Math.round((offer.serviceValue + (offer.serviceValue * offer.rate * offer.months / 1200)) / offer.months);
    };

}
