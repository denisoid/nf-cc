'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:04
 */
function CarConfigurationCtrl($scope, $filter, LoanProducts, Packaging_LoanProduct, Products, Packagings, Marks, Models, $timeout, CalculatorData) {

    //init
    $scope.car = CalculatorData.calculation.car;
    $scope.current = {mark: null, model: null, pack: null};

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
            $scope.current.mark = $scope.selMarkList[0];
        } else {
            $scope.current.mark = null;
        }
        $scope.updateModel();
    }

    $scope.updateModel = function () {

        if ($scope.modelList.length == 0) return;
        $scope.selModelList = $filter('filter')($scope.modelList, function (element) {
            return element.markId == $scope.current.mark.id;
        });
        if ($scope.selModelList.length > 0) {
            $scope.current.model = $scope.selModelList[0];
        } else {
            $scope.current.model = null;
        }
        $scope.updatePackaging();
    }

    $scope.updatePackaging = function () {
        if ($scope.packagingList.length == 0) return;
        $scope.selPackagingList = $filter('filter')($scope.packagingList, function (element) {
            return element.modelId == $scope.current.model.id;
        });
        if ($scope.selPackagingList.length > 0) {
            $scope.current.pack = $scope.selPackagingList[0];
        } else {
            $scope.current.pack = null;
        }
    }

    $scope.updateCarForPackaging = function () {
        var searchedId = $scope.current.pack.id;
        if (searchedId == null) {
            return;
        }
        var packaging = null;
        for (var ti = 0, len = $scope.selPackagingList.length; ti < len; ti++) {
            var pack = $scope.selPackagingList[ti];
            if (pack.id == searchedId) {
                packaging = pack;
                break;
            }
        }
        if (packaging == null) {
            $scope.car.price = null;
            $scope.car.discount = null;
        } else {
            $scope.car.price = packaging.cost;
            $scope.car.discount = packaging.discount;
        }
    }

    $scope.$watch('current.mark', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.car.markId = $scope.current.mark.id;
        $scope.car.markName = $scope.current.mark.name;
    });

    $scope.$watch('current.model', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.car.modelId = $scope.current.model.id;
        $scope.car.modelName = $scope.current.model.name;
    });

    $scope.$watch('current.pack', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.updateCarForPackaging();
        $scope.car.packagingId = $scope.current.pack.id;
        $scope.car.packagingName = $scope.current.pack.name;
    });
}
