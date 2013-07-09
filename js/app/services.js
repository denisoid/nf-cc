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
                loanproduct: null,
                offer: null
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
                    loanproduct: null,
                    offer: this.calculation.offer
                });
            },
            delCalculation: function (ind) {
                this.calculationList.splice(ind, true);
            },
            restoreCalculation: function (ind) {
                this.calculation = this.calculationList[ind];
            }
        }
    }
);