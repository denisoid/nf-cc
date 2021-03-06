'use strict';

/* Services */

var seedAppServiceModule = angular.module('seedApp.services', []);

seedAppServiceModule.value('version', '0.1');

seedAppServiceModule.
    factory('LoanProducts', function ($resource) {
        var data = $resource('js/data/loanproducts.json', {}, {});
        return data;
    });

seedAppServiceModule.
    factory('Packaging_LoanProduct', function ($resource) {
        var data = $resource('js/data/packaging_loanproduct.json', {}, {});
        return data;
    });

seedAppServiceModule.
    factory('Products', function ($resource) {
        var data = $resource('js/data/products.json', {}, {});
        return data;
    });

seedAppServiceModule.
    factory('Packagings', function ($resource) {
        var data = $resource('js/data/packagings.json', {}, {});
        return data;
    });

seedAppServiceModule.
    factory('Marks', function ($resource) {
        var data = $resource('js/data/marks.json', {}, {});
        return data;
    });

seedAppServiceModule.
    factory('Models', function ($resource) {
        var data = $resource('js/data/models.json', {}, {});
        return data;
    });

seedAppServiceModule.
    factory('ServiceGroups', function ($resource) {
        var data = $resource('js/data/service_groups.json', {}, {});
        return data;
    });

seedAppServiceModule.
    factory('CalculatorData', function () {
        return {
            calculation: {
                car: {
                    used: false,
                    mark: null,
                    model: null,
                    pack: null,
                    yearId: null,
                    dealerDiscount: 0
                },
                offerIndex: 0,
                offer: {
                    creditValue: 0,
                    product: null,
                    months: 0,
                    monthPayment: 0,
                    overPayment: 0,
                    returnValue: 0,
                    serviceValue: 0,
                    serviceDiscount: 0,
                    carMonthPayment: 0,
                    serviceMonthPayment: 0,
                    services: {
                        sum: 0,
                        discount: 0,
                        grouplist: [],
                        init: function () {
                            var glength = this.grouplist.length;
                            for (var ti = 0; ti < glength; ti++) {
                                if (!this.grouplist[ti].mandatory) {
                                    this.grouplist[ti].servicelist.splice(0,0,{
                                        "name": "",
                                            "price": "0",
                                            "discount": "0"
                                    });
                                }
                                var slist = this.grouplist[ti].servicelist;
                                if (slist.length > 0) {
                                    this.grouplist[ti].selected = slist[0];
                                }
                            }
                        },
                        calculateSum: function () {
                            var glength = this.grouplist.length;
                            var newsum = 0;
                            var newdiscount = 0;
                            for (var ti = 0; ti < glength; ti++) {
                                if (this.grouplist[ti].selected == null) {
                                    continue;
                                }
                                var price = parseFloat(this.grouplist[ti].selected.price);
                                if (isNaN(price) || price == null) {
                                    price = 0;
                                }
                                var discount = parseFloat(this.grouplist[ti].selected.discount);
                                if (isNaN(discount) || discount == null) {
                                    discount = 0;
                                }
                                newsum += price;
                                newdiscount += discount;
                            }
                            this.sum = newsum;
                            this.discount = newdiscount;
                        }
                    }
                },
                parameters: {
                    initialPayment: 0,
                    monthPaymentFilter: 0,
                    tradeIn: 0,
                    refinance: 0,
                    lastPayment: 0,
                    clientRCI: true,
                    existCRM: true
                }
            },
            calculationList: [],
            saveCalculation: function () {
                var calculationCopy = {
                    car: {
                        used: this.calculation.car.used,
                        mark: this.calculation.car.mark,
                        model: this.calculation.car.model,
                        pack: this.calculation.car.pack,
                        yearId: this.calculation.car.yearId,
                        dealerDiscount: this.calculation.car.dealerDiscount
                    },
                    offerIndex: this.calculation.offerIndex,
                    offer: copyObject1Level(this.calculation.offer),
                    parameters: copyObject1Level(this.calculation.parameters)
                };
                calculationCopy.offer.services = angular.copy(calculationCopy.offer.services);
                this.calculationList.push(calculationCopy);
            },
            delCalculation: function (ind) {
                this.calculationList.splice(ind, true);
            },
            restoreCalculation: function (ind) {
                var copy = this.calculationList[ind];
                this.calculation.car = {
                    used: copy.car.used,
                    mark: copy.car.mark,
                    model: copy.car.model,
                    pack: copy.car.pack,
                    yearId: copy.car.yearId,
                    dealerDiscount: copy.car.dealerDiscount
                }
                this.calculation.offerIndex = copy.offerIndex;
                this.calculation.offer = copyObject1Level(copy.offer);
                this.calculation.offer.services = angular.copy(copy.offer.services);
                this.calculation.parameters = copyObject1Level(copy.parameters);
            },
            resetOffer: function () {
                var offer = this.calculation.offer;
                offer.creditValue = 0;
                offer.product = null;
                offer.months = 0;
                offer.monthPayment = 0;
                offer.overPayment = 0;
                offer.returnValue = 0;
                offer.serviceValue = 0;
                offer.serviceDiscount = 0;
                offer.carMonthPayment = 0;
                offer.serviceMonthPayment = 0;
            }
        }
    }
);

seedAppServiceModule.
    factory('ClientData', function () {
        return {
            maxCreditValue: 3000000,
            maxMonthPayment: 100000
        };
    });
