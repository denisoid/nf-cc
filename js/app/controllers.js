'use strict';

/* Controllers */

function CalculatorCtrl($scope) {
    $scope.car = {
        price: 813670,
        casco: 0,
        osago: 0
    }

    $scope.summ = function() {
        return parseFloat($scope.car.price) + parseFloat($scope.car.osago) + parseFloat($scope.car.casco);
    }

}

