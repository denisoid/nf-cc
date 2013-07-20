'use strict';

/**
 * User: ikotenko
 * Date: 08.07.13
 * Time: 18:46
 */
function PrintCtrl($scope, $window, CalculatorData) {
    $scope.data = CalculatorData;

    $scope.printOffer = function() {
        $window.print();
	$("a.rotate").click();
    }


    $scope.printGrid = function() {
        var win = $window.open("grid.html");
    }

}
