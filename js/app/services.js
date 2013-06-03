'use strict';

/* Services */

var seedAppServiceModule = angular.module('seedApp.services', []);

seedAppServiceModule.value('version', '0.1');

seedAppServiceModule.
    factory('Task', function($resource){
        var taskData = $resource('http://rciserv01/rest/bpm/htm/v1/tasks/filter', {}, {});
        return taskData;
    });