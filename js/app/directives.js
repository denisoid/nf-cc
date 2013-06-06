'use strict';

/* Directives */

var seedAppDirectives = angular.module('seedApp.directives', []);

seedAppDirectives.directive('appVersion', ['version', function (version) {
    return function (scope, elm, attrs) {
        elm.text(version);
    };
}]);

seedAppDirectives.directive('slider', function () {
    return {
        restrict: 'A',
        require : '?ngModel',
        replace : true,
        controller: function($scope) {
            $scope.$watch($scope.min, function(newVal, oldVal) {
                if(newVal === oldVal) return;
                $(elem).slider("option", "min", parseInt($scope.min));
            });
            $scope.$watch($scope.max, function(newVal, oldVal) {
                if(newVal === oldVal) return;
                $(elem).slider("option", "max", parseInt($scope.max));
            });
            $scope.$watch($scope.step, function(newVal, oldVal) {
                if(newVal === oldVal) return;
                $(elem).slider("option", "step", parseInt($scope.step));
            });
            $scope.$watch($scope.ngModel, function(newVal, oldVal) {
                if(newVal === oldVal) return;
                $(elem).slider("value", parseInt($scope.ngModel));
            });
        },
        link: function (scope, elem, attrs, ctrl) {
            $(elem).slider({
                min: scope.$eval(attrs.min),
                max: scope.$eval(attrs.max),
                step: scope.$eval(attrs.step),
                value: scope.$eval(attrs.ngModel),
                slide: function (event, ui) {
                    scope.$apply(function() {
                        ctrl.$setViewValue(ui.value);
                    });
                }
            });
        }
    }
});
