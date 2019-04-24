'use strict';

/**
 * @ngdoc filter
 * @name webappApp.filter:imagePath
 * @function
 * @description
 * # imagePath
 * Filter in the webappApp.
 */
angular.module('webappApp')
    .filter('imagePath', ['config', function(config) {
        return function(input) {
            if (input) {
                return config.apiUrl + '/Attachment/image/' + input;
            }
        };
    }]);
