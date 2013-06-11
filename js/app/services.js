'use strict';

/* Services */

var seedAppServiceModule = angular.module('seedApp.services', []);

seedAppServiceModule.value('version', '0.1');

seedAppServiceModule.
    factory('CarCompanys', function ($resource) {
        return [
            {id: "c1", name: "Марка"},
            {id: "c2", name: "DMC"},
            {id: "c3", name: "Ваз"},
            {id: "c4", name: "Nissan"}
        ];
    });

seedAppServiceModule.
    factory('CarModels', function ($resource) {
        return [
            {id: "cm1", name: "Модель1"},
            {id: "cm2", name: "Модель2"},
            {id: "cm3", name: "Модель3"},
            {id: "cm4", name: "Модель4"}
        ]
    });

seedAppServiceModule.
    factory('CarModifs', function ($resource) {
        return [
            {id: "m1", name: "Модификация1"},
            {id: "m2", name: "Модификация2"},
            {id: "m3", name: "Модификация3"},
            {id: "m4", name: "Модификация4"}
        ]
    });

seedAppServiceModule.
    factory('CarYears', function ($resource) {
        return [
            {"id": "y2000", "name": "2000"},
            {"id": "y2001", "name": "2001"},
            {"id": "y2011", "name": "2011"},
            {"id": "y2013", "name": "2013"}
        ]
    });

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
            price: 800000,
            markId: undefined,
            modelId: undefined,
            packagingId: undefined,
            yearId: undefined
        }

    });