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
            return;
        }
        var price = $scope.data.calculation.car.pack.price;
        var maxPrice = price * (1+$scope.deltaPercent/100);
        var selectedPackageList = $filter('filter')($scope.packagingList, function (element) {
                if ((element.cost > price) && (element.cost < maxPrice)) {
                    return true;
                }
                return false;
            }
        );
        $scope.carUpgrade.setup(selectedPackageList);

        var selectedServicesList = $filter('filter')($scope.packagingList, function (element) {
                if ((element.cost > price) && (element.cost < maxPrice)) {
                    return true;
                }
                return false;
            }
        );

        var length = selectedPackageList.length;
        for(var ti = 0; ti < length; ti++) {
            var pack = selectedPackageList[ti];
            pack.modelName = $scope.getModelNameById(pack.modelId);
        }

        $scope.serviceUpgrade.setup(selectedServicesList);
    }

    $scope.getModelNameById = function(modelId) {
        var modelList = $filter('filter')($scope.modelList, function (element) {
                if (element.id == modelId) {
                    return true;
                }
                return false;
            }
        );
        if(modelList.length > 0) {
            return modelList[0].name;
        }
        return null;
    }

    $scope.upgrade = function (idx) {
        $window.alert(idx);
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
