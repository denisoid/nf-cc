'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:04
 */
function CarSearchCtrl($scope, $filter, CalculatorData) {
    $scope.selCars = [];
    $scope.searchPrice = 1000000;
    $scope.calculation = CalculatorData.calculation;

    $scope.selectCar = function (ind) {
        $scope.calculation.car = {
            used: false,
            price: null,
            discount: null,
            markId: null,
            modelId: null,
            packagingId: null,
            yearId: null,
            markName: 'mark',
            modelName: 'model'
        };
    }

    $scope.searchCar = function () {
        var delta = $scope.searchPrice * 0.1;

        var selPackagingListForPrice = $filter('filter')($scope.packagingList, function (element) {
                if (Math.abs($scope.searchPrice - element.cost) < delta) {
                    return true;
                }
                return false;
            }
        );

        var markId = $scope.calculation.car.markId;

        if (markId == null) {
            $scope.selCars = selPackagingListForPrice;
            return;
        }

        var modelId = null;

        if ($scope.calculation.car.modelId == null) {

            var modelList = $scope.selModelList;
            var selPackagingListForPriceAndMark = [];
            for (var ti = 0; ti < modelList.length; ti++) {
                modelId = modelList[ti].id;
                var selPackagingListForPriceAndModel = $filter('filter')(selPackagingListForPrice, function (element) {
                        if (element.modelId == modelId) {
                            return true;
                        }
                        return false;
                    }
                );
                if (selPackagingListForPriceAndModel.length > 0) {
                    selPackagingListForPriceAndMark = selPackagingListForPriceAndMark.concat(selPackagingListForPriceAndModel);
                }
            }

            $scope.selCars = selPackagingListForPriceAndMark;
            return;
        }

        modelId = $scope.calculation.car.modelId;
        var selPackagingListForPriceAndModel = $filter('filter')(selPackagingListForPrice, function (element) {
                if (element.modelId == modelId) {
                    return true;
                }
                return false;
            }
        );

        $scope.selCars = selPackagingListForPriceAndModel;
    }

    $scope.$watch('searchPrice', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.searchCar();
    });
}
