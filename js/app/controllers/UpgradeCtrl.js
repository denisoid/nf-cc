'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:19
 */
function UpgradeCtrl($scope, $filter, CalculatorData, Packagings) {

    $scope.deltaPercent = 10;
    $scope.data = CalculatorData;

    $scope.packagingList = Packagings.query({}, function () {
        $scope.updateUpgrades();
    });


    $scope.carUpgrade = new ListWithPaging([], 3);
    $scope.serviceUpgrade = new ListWithPaging([], 3);

    $scope.updateUpgrades = function () {
        var price = $scope.data.calculation.car.price;
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
        $scope.serviceUpgrade.setup(selectedServicesList);
    }

    $scope.show = function (idx) {
        window.alert(idx);
    }

    $scope.$watch('car.packagingId', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.updateUpgrades();
    });
}
