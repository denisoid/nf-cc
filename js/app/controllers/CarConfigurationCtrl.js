'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:04
 */
function CarConfigurationCtrl($scope, $filter, LoanProducts, Packaging_LoanProduct, Products, Packagings, Marks, Models, $timeout, CalculatorData) {

    //init
    $scope.calculation = CalculatorData.calculation;
    $scope.car = CalculatorData.calculation.car;

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

    $scope.car.yearId = currentYear;

    $scope.resetMark = function () {
        $scope.car.mark = null;
        $scope.car.model = null;
        $scope.car.pack = null;
        $scope.updateMark();
    }
    $scope.resetModel = function () {
        $scope.car.model = null;
        $scope.car.pack = null;
        $scope.updateModel();
    }

    $scope.resetPack = function () {
        $scope.car.pack = null;
        $scope.updatePack();
    }

    $scope.updateMark = function () {
        if ($scope.markList.length == 0) {
            car.mark = null;
        } else {
            $scope.selMarkList = $filter('filter')($scope.markList, function (element) {
                return element.used == $scope.car.used;
            });
            if ($scope.selMarkList.length > 0 && $scope.car.mark == null) {
                $scope.car.mark = $scope.selMarkList[0];
            } else {
                $scope.car.mark = null;
            }
        }
        $scope.updateModel();
    }

    $scope.updateModel = function () {
        if ($scope.car.mark == null) {
            $scope.car.model = null;
        } else {
            if ($scope.modelList.length == 0) {
                $scope.car.model = null;
            } else {
                $scope.selModelList = $filter('filter')($scope.modelList, function (element) {
                    return element.markId == $scope.car.mark.id;
                });
                if ($scope.selModelList.length > 0 && $scope.car.model == null) {
                    $scope.car.model = $scope.selModelList[0];
                } else {
                    $scope.car.model = null;
                }
            }
        }
        $scope.updatePack();
    }

    $scope.updatePack = function () {
        if (($scope.packagingList.length == 0) || ($scope.car.model == null)) {
            $scope.selPackagingList = [];
            $scope.car.pack = null;
            return;
        }
        $scope.selPackagingList = $filter('filter')($scope.packagingList, function (element) {
            return element.modelId == $scope.car.model.id;
        });

        if ($scope.selPackagingList.length > 0) {
            if($scope.car.pack == null) {
                $scope.car.pack = $scope.selPackagingList[0];
            }
        } else {
            $scope.car.pack = null;
        }
    }

    /*
    $scope.$watch('car.mark', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.updateModel();
    });
    */

}
