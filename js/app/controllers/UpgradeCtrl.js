'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:19
 */
function UpgradeCtrl($scope, $filter, CalculatorData, Packagings, Models, $window) {

    $scope.deltaPercent = 10;
    $scope.data = CalculatorData;

    $scope.packagingList = Packagings.query({}, function () {
        $scope.updateUpgrades();
    });

    $scope.modelList = Models.query({}, function () {
        $scope.updateUpgrades();
    });

    $scope.upgradeMonths = 1;

    $scope.carUpgrade = new ListWithPaging([], 3);
    $scope.serviceUpgrade = new ListWithPaging([], 3);

    $scope.updateUpgrades = function () {
        if($scope.data.calculation.car.pack == null) {
            $scope.carUpgrade.setup([]);
            $scope.serviceUpgrade.setup([]);
            return;
        }
        var price = $scope.data.calculation.car.pack.price;
        var maxPrice = price * (1+$scope.deltaPercent/100);
        var markId = $scope.data.calculation.car.mark.id;
        var selectedPackageList = $filter('filter')($scope.packagingList, function (element) {
                if ((element.price > price) && (element.price < maxPrice) && (element.markId == markId)) {
                    return true;
                }
                return false;
            }
        );
        var carUpgradeList = [];
        var length = selectedPackageList.length;

        if(length > 3) length = 3; //TODO - rewrite - now cut to 3

        for(var ti = 0; ti < length; ti++) {
            var pack = selectedPackageList[ti];
            var model = $scope.getModelById(pack.modelId);
            carUpgradeList.push({pack: pack, model: model});
        }

        $scope.carUpgrade.setup(carUpgradeList);

        var selectedServicesList = $filter('filter')($scope.packagingList, function (element) {
                if ((element.price > price) && (element.price < maxPrice)) {
                    return true;
                }
                return false;
            }
        );

        length = selectedPackageList.length;

        if(length > 3) length = 3; //TODO - rewrite - now cut to 3

        for(var ti = 0; ti < length; ti++) {
            var pack = selectedPackageList[ti];
            pack.model = $scope.getModelById(pack.modelId);
        }

        $scope.serviceUpgrade.setup(selectedServicesList);
    }

    $scope.getModelById = function(modelId) {
        var modelList = $filter('filter')($scope.modelList, function (element) {
                if (element.id == modelId) {
                    return true;
                }
                return false;
            }
        );
        if(modelList.length > 0) {
            return modelList[0];
        }
        return null;
    }

    $scope.upgradeCar = function (offer) {
        $scope.data.saveCalculation();
        $scope.data.calculation.car.model = offer.model;
        $scope.data.calculation.car.pack = offer.pack;
    }

    $scope.upgradeService = function (offer) {
    }

    $scope.$watch('data.calculation.offer', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.updateUpgrades();
    });

    $scope.$watch('upgradeMonths', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.updateUpgrades();
    });
}
