'use strict';


// Declare app level module which depends on filters, and services
var seedAppModule = angular.module('seedApp',
    [
        'seedApp.services',
        'seedApp.directives',
        'ngResource',
        'ui.utils',
        'ui.bootstrap'
    ]
);

seedAppModule.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/maxpayment', {templateUrl: 'partials/maxpayment.html', controller: MaxPaymentCtrl}).
        otherwise({redirectTo: '/'});
}]);