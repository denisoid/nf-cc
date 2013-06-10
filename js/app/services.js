'use strict';

/* Services */

var seedAppServiceModule = angular.module('seedApp.services', []);

seedAppServiceModule.value('version', '0.1');

seedAppServiceModule.
    factory('Task', function ($resource) {
        var taskData = $resource('http://rciserv01/rest/bpm/htm/v1/tasks/filter', {}, {});
        return taskData;
    });

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
            {id: "y2000", name: "2000"},
            {id: "y2001", name: "2001"},
            {id: "y2011", name: "2011"},
            {id: "y2013", name: "2013"}
        ]
    });

seedAppServiceModule.
    factory('LoanProducts', function ($resource) {
        return [
            {id: "p1", name: "Программа 1", minip:0, maxip:10, minterm: 0, maxterm: 3, rate: 10},
            {id: "p1", name: "Программа 1", minip:11, maxip:30, minterm: 0, maxterm: 3, rate: 9.5},
            {id: "p1", name: "Программа 1", minip:31, maxip:100, minterm: 0, maxterm: 3, rate: 9},
            {id: "p1", name: "Программа 1", minip:0, maxip:10, minterm: 4, maxterm: 9, rate: 11.5},
            {id: "p1", name: "Программа 1", minip:11, maxip:30, minterm: 4, maxterm: 9, rate: 11},
            {id: "p1", name: "Программа 1", minip:31, maxip:100, minterm: 4, maxterm: 9, rate: 10.5},
            {id: "p1", name: "Программа 1", minip:0, maxip:10, minterm: 10, maxterm: 24, rate: 12.5},
            {id: "p1", name: "Программа 1", minip:11, maxip:30, minterm: 10, maxterm: 24, rate: 12},
            {id: "p1", name: "Программа 1", minip:31, maxip:100, minterm: 10, maxterm: 24, rate: 11.5},
            {id: "p2", name: "Программа 2", minip:0, maxip:10, minterm: 0, maxterm: 3, rate: 9},
            {id: "p2", name: "Программа 2", minip:11, maxip:30, minterm: 0, maxterm: 3, rate: 8.5},
            {id: "p2", name: "Программа 2", minip:31, maxip:100, minterm: 0, maxterm: 3, rate: 8},
            {id: "p2", name: "Программа 2", minip:0, maxip:10, minterm: 4, maxterm: 9, rate: 10.5},
            {id: "p2", name: "Программа 2", minip:11, maxip:30, minterm: 4, maxterm: 9, rate: 10},
            {id: "p2", name: "Программа 2", minip:31, maxip:100, minterm: 4, maxterm: 9, rate: 9.5},
            {id: "p2", name: "Программа 2", minip:0, maxip:10, minterm: 10, maxterm: 36, rate: 11.5},
            {id: "p2", name: "Программа 2", minip:11, maxip:30, minterm: 10, maxterm: 36, rate: 11},
            {id: "p2", name: "Программа 2", minip:31, maxip:100, minterm: 10, maxterm: 36, rate: 10.5}
        ]
    });

seedAppServiceModule.
    factory('CarConfiguration', function ($resource) {
        return {
            price: 800000,
            companyId: undefined,
            modelId: undefined,
            modifId: undefined,
            yearId: undefined
        }

    });