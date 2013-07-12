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
                    clientRCI:true
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
                this.calculation.car.used = this.calculationList[ind].car.used;
                this.calculation.car.mark = this.calculationList[ind].car.mark;
                this.calculation.car.model = this.calculationList[ind].car.model;
                this.calculation.car.pack = this.calculationList[ind].car.pack;
                this.calculation.car.yearId = this.calculationList[ind].car.yearId

                this.calculation.loanproduct = this.calculationList[ind].loanproduct;
                this.calculation.offer = this.calculationList[ind].offer;
                this.calculation.parameters = this.calculationList[ind].parameters;
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
