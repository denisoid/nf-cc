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
                offer: {
                    loanproduct: {},
                    services: []
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
                    offer: this.calculation.offer,
                    parameters: this.calculation.parameters
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

                this.calculation.loanproduct = copy.loanproduct;
                this.calculation.offer = copy.offer;
                this.calculation.parameters = {
                    initialPayment: copy.parameters.initialPayment,
                    monthPaymentFilter: copy.parameters.monthPaymentFilter,
                    tradeIn: copy.parameters.tradeIn,
                    refinance: copy.parameters.refinance,
                    lastPayment: copy.parameters.lastPayment,
                    clientRCI: copy.parameters.clientRCI,
                    existCRM: copy.parameters.existCRM
                }
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
