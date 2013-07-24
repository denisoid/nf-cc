'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:04
 */
function CarConfigurationCtrl($rootScope, $scope, $filter, LoanProducts, Packaging_LoanProduct, Products, Packagings, Marks, Models, $timeout, CalculatorData) {

    //init
    $scope.data = CalculatorData;
    var car = $scope.data.calculation.car;

    $scope.selMarkList = [];
    $scope.selModelList = [];
    $scope.selPackagingList = [];

    $scope.markList = Marks.query({}, function () {
        $scope.updateMark();
    });
    $scope.modelList = Models.query({}, function () {
        $scope.updateModel();
    });
    $scope.packagingList = Packagings.query({}, function () {
        $scope.updatePack();
    });

    //$scope.yearList = Years.query();
    $scope.selYearList = [];
    var currentYear = (new Date()).getFullYear();
    for (var ti = currentYear; ti > currentYear - 20; ti--) {
        $scope.selYearList.push({"yearId": ti});
    }

    car.yearId = currentYear;

    $scope.resetMark = function () {
        var car = $scope.data.calculation.car;
        car.mark = null;
        car.model = null;
        car.pack = null;
        $scope.updateMark();
    }
    $scope.resetModel = function () {
        var car = $scope.data.calculation.car;
        car.model = null;
        car.pack = null;
        $scope.updateModel();
    }

    $scope.resetPack = function () {
        var car = $scope.data.calculation.car;
        car.pack = null;
        $scope.updatePack();
    }

    $scope.updateMark = function () {
        var car = $scope.data.calculation.car;
        if ($scope.markList.length == 0) {
            car.mark = null;
        } else {
            $scope.selMarkList = $filter('filter')($scope.markList, function (element) {
                return element.used == car.used;
            });
            if ($scope.selMarkList.length > 0 && car.mark == null) {
                car.mark = $scope.selMarkList[0];
            } else {
                car.mark = null;
            }
        }
        $scope.updateModel();
    }

    $scope.updateModel = function () {
        var car = $scope.data.calculation.car;
        if (car.mark == null) {
            car.model = null;
        } else {
            if ($scope.modelList.length == 0) {
                car.model = null;
            } else {
                $scope.selModelList = $filter('filter')($scope.modelList, function (element) {
                    return element.markId == car.mark.id;
                });
                if ($scope.selModelList.length == 0) {
                    car.model = null;
                } else {
                    if (car.model == null) {
                        car.model = $scope.selModelList[0];
                    }
                }
            }
        }
        $scope.updatePack();
    }

    $scope.updatePack = function () {
        var car = $scope.data.calculation.car;
        if (($scope.packagingList.length == 0) || (car.model == null)) {
            $scope.selPackagingList = [];
            car.pack = null;
            return;
        }
        $scope.selPackagingList = $filter('filter')($scope.packagingList, function (element) {
            return element.modelId == car.model.id;
        });

        if ($scope.selPackagingList.length > 0) {
            if (car.pack == null) {
                car.pack = $scope.selPackagingList[0];
            }
        } else {
            car.pack = null;
        }
    }

    $scope.$watch('data.calculation.car.dealerDiscount', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $rootScope.$broadcast('car.changed');
    });

    $scope.$watch('data.calculation.car.pack', function (newVal, oldVal) {
        var car = $scope.data.calculation.car;
        if (car.mark == null) return;
        if (car.model == null) return;
        if (car.pack == null) return;
        if ($scope.selModelList.length == 0) {
            $scope.updateModel();
        }
        if ($scope.selModelList[0].markId != car.mark.id) {
            $scope.updateModel();
        }
        if ($scope.selPackagingList.length == 0) {
            $scope.updatePack();
        }
        if ($scope.selPackagingList[0].modelId != car.model.id) {
            $scope.updatePack();
        }
    });
}
