'use strict';

/**
 * User: ikotenko
 * Date: 08.07.13
 * Time: 18:46
 */
function PrintCtrl($scope, $window) {
    $scope.printOffer = function() {
        $window.print();
    }


    $scope.printGrid = function() {
        var win = $window.open("grid.html");
    }

}
