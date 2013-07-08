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
    factory('CarConfiguration', function ($resource) {
        return {
            used: false,
            price: undefined,
            discount: undefined,
            markId: undefined,
            modelId: undefined,
            packagingId: undefined,
            yearId: undefined
        }

    });

seedAppServiceModule.
    factory('CalculatorData', function () {
        return {
            calculation: {
                car: {
                    used: false,
                    price: 0,
                    discount: 0,
                    markId: null,
                    modelId: null,
                    packagingId: null,
                    yearId: null
                },
                loanproduct: null,
                offer: null
            },
            calculationList: [],
            saveCalculation: function (currentOffer) {

                this.calculationList.push({
                    car: {
                        used: this.calculation.car.used,
                        price: this.calculation.car.price,
                        discount: this.calculation.car.discount,
                        markId: this.calculation.car.markId,
                        modelId: this.calculation.car.modelId,
                        packagingId: this.calculation.car.packagingId,
                        yearId: this.calculation.car.yearId
                    },
                    loanproduct: null,
                    offer: currentOffer
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