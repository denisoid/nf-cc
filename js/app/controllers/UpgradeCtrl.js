'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 14:19
 */
function UpgradeCtrl($scope) {

    $scope.carUpgrade = new ListWithPaging([{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7}], 3);
    $scope.serviceUpgrade = new ListWithPaging([{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7}], 3);

    $scope.updateUpgrades = function () {
        $scope.carUpgrade.setup([{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7}]);
        $scope.serviceUpgrade.setup([{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7}]);
    }



}
