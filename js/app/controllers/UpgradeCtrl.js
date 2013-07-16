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

    $scope.upgradeMonths = 0;

    $scope.carUpgrade = new ListWithPaging([], 3);
    $scope.serviceUpgrade = new ListWithPaging([], 3);

    $scope.getCreditReturnValue = function (pack) {
        var months = $scope.data.calculation.offer.months + $scope.upgradeMonths;
        var parameters = $scope.data.calculation.parameters;
        var rate = parseFloat($scope.data.calculation.offer.product.rate);
        if(isNaN(rate)) {
            rate = 0;
        }
        var discount = parseFloat(pack.discount);
        if(isNaN(discount)) {
            discount = 0;
        }
        var price = parseFloat(pack.price) - discount - parameters.initialPayment - parameters.tradeIn + parameters.refinance;
        var result = price + price*rate*months/1200;
        return result;
    }


    $scope.updateCarUpgrades = function () {
        var months = $scope.data.calculation.offer.months + $scope.upgradeMonths;
        var price = $scope.data.calculation.car.pack.price;
        var maxPrice = price * (1 + $scope.deltaPercent / 100);
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
        if(length > 0) {

            var currentReturnValue = $scope.getCreditReturnValue($scope.data.calculation.car.pack);

            if (length > 3) length = 3; //TODO - rewrite algorithm - now cut to 3

            for (var ti = 0; ti < length; ti++) {
                var pack = selectedPackageList[ti];
                var model = $scope.getModelById(pack.modelId);
                var newReturnValue = $scope.getCreditReturnValue(pack);

                var monthDelta = (newReturnValue - currentReturnValue)/months;
                carUpgradeList.push({"monthDelta": monthDelta, "car": {pack: pack, model: model}});
            }
        }

        $scope.carUpgrade.setup(carUpgradeList);
    };

    $scope.updateServiceUpgrades = function () {
        if($scope.data.calculation.offer.product == null) {
            $scope.serviceUpgrade.setup([]);
            return;
        }
        var months = $scope.data.calculation.offer.months + $scope.upgradeMonths;
        var grouplist = $scope.data.calculation.offer.services.grouplist;
        var upgradeList = [];
        var glength = grouplist.length;
        for (var ti = 0; ti < glength; ti++) {
            var group = grouplist[ti];
            var slist = group.servicelist;
            var slength = group.servicelist.length;
            if (slength == 0) continue;
            if (group.selected == null) {
                var newService = slist[0];
                var delta = parseFloat(slist[0].price) - parseFloat(slist[0].discount);
                var monthDelta = delta / months;
                upgradeList.push({"group": group, "delta": delta, "monthDelta": monthDelta, "newService": newService});
                continue;
            }
            var currentService = group.selected;
            slength -= 1;//check all but last element
            for (var tj = 0; tj < slength; tj++) {
                if (currentService == slist[tj]) {
                    var newService = slist[tj + 1];
                    var delta = parseFloat(newService.price) - parseFloat(newService.discount) - parseFloat(group.selected.price) + parseFloat(group.selected.discount);
                    var monthDelta = delta / months;
                    upgradeList.push({"group": group, "delta": delta, "monthDelta": monthDelta, "newService": newService});
                    break;
                }
            }
        }

        var length = upgradeList.length;

        if (length > 3) length = 3; //TODO - rewrite - now cut to 3
        var selectedUpgradeList = []
        for (var ti = 0; ti < length; ti++) {
            selectedUpgradeList.push(upgradeList[ti]);
        }
        $scope.serviceUpgrade.setup(selectedUpgradeList);
    };

    $scope.updateUpgrades = function () {
        if (($scope.data.calculation.car.pack == null) || ($scope.data.calculation.offer.product == null)) {
            $scope.carUpgrade.setup([]);
            $scope.serviceUpgrade.setup([]);
            return;
        }
        this.updateCarUpgrades();
        this.updateServiceUpgrades();
    }

    $scope.getModelById = function (modelId) {
        var modelList = $filter('filter')($scope.modelList, function (element) {
                if (element.id == modelId) {
                    return true;
                }
                return false;
            }
        );
        if (modelList.length > 0) {
            return modelList[0];
        }
        return null;
    }

    $scope.upgradeCar = function (offer) {
        $scope.data.saveCalculation();
        $scope.data.calculation.car.model = offer.car.model;
        $scope.data.calculation.car.pack = offer.car.pack;
    }

    $scope.upgradeService = function (serviceUpgrade) {
        $scope.data.saveCalculation();
        serviceUpgrade.group.selected = serviceUpgrade.newService;
        $scope.data.calculation.offer.services.calculateSum();
    }

    $scope.$watch('data.calculation.offer.product', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.updateUpgrades();
    });

    $scope.$watch('data.calculation.car.pack', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.updateUpgrades();
    });

    $scope.$watch('upgradeMonths', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.updateUpgrades();
    });

    $scope.$watch('data.calculation.offer.services.sum', function (newVal, oldVal) {
        if (newVal === oldVal) return;
        $scope.updateServiceUpgrades();
    });
}
