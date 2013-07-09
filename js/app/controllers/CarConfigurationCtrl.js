'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:04
 */
function CarConfigurationCtrl($scope, $filter, LoanProducts, Packaging_LoanProduct, Products, Packagings, Marks, Models, $timeout, CalculatorData) {

    //init
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
        $scope.updatePackaging();
    });

    //$scope.yearList = Years.query();
    $scope.selYearList = [];
    var currentYear = (new Date()).getFullYear();
    for (var ti = currentYear; ti > currentYear - 20; ti--) {
        $scope.selYearList.push({"yearId": ti});
    }

    $scope.car.yearId = currentYear;

    $scope.updateMark = function () {
        if ($scope.markList.length == 0) return;
        $scope.selMarkList = $filter('filter')($scope.markList, function (element) {
            return element.used == $scope.car.used;
        });
        if ($scope.selMarkList.length > 0) {
            $scope.car.mark = $scope.selMarkList[0];
        } else {
            $scope.car.mark = null;
        }
        $scope.updateModel();
    }

    $scope.updateModel = function () {
        if($scope.car.mark == null) {
            $scope.car.model = null;
            return;
        }
        if ($scope.modelList.length == 0) return;
        $scope.selModelList = $filter('filter')($scope.modelList, function (element) {
            return element.markId == $scope.car.mark.id;
        });
        if ($scope.selModelList.length > 0) {
            $scope.car.model = $scope.selModelList[0];
        } else {
            $scope.car.model = null;
        }
        $scope.updatePackaging();
    }

    $scope.updatePackaging = function () {
        if($scope.car.model == null) {
            $scope.car.pack = null;
            return;
        }
        if ($scope.packagingList.length == 0) return;
        $scope.selPackagingList = $filter('filter')($scope.packagingList, function (element) {
            return element.modelId == $scope.car.model.id;
        });
        if ($scope.selPackagingList.length > 0) {
            $scope.car.pack = $scope.selPackagingList[0];
        } else {
            $scope.car.pack = null;
        }
    }
}
