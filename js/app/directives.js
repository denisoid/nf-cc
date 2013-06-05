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
        link: function (scope, elem, attrs) {
            $(elem).slider({
                range: true,
                min: scope.days[1],
                max: scope.days[scope.days.length - 1],
                values: [scope.days[0], scope.days[scope.days.length - 1]],
                slide: function (event, ui) {
                    console.log(ui.values[0], ui.values[1]);
                }
            });
        }
    }
});
