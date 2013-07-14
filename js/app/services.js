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
                    yearId: null
                },
                offerIndex: 0,
                offer: {
                    creditValue: 0,
                    product: {},
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
                                if (this.grouplist[ti].mandatory) {
                                    var slist = this.grouplist[ti].servicelist;
                                    if (slist.length > 0) {
                                        this.grouplist[ti].selected = slist[0];
                                    }
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
                this.calculationList.push({
                    car: {
                        used: this.calculation.car.used,
                        mark: this.calculation.car.mark,
                        model: this.calculation.car.model,
                        pack: this.calculation.car.pack,
                        yearId: this.calculation.car.yearId
                    },
                    offer: $.extend(true, {}, this.calculation.offer),
                    parameters: $.extend(true, {}, this.calculation.parameters)
                });
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
                    yearId: copy.car.yearId
                }

                this.calculation.offer = copyObject1Level(copy.offer);
                this.calculation.parameters = copyObject1Level(copy.parameters);
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
