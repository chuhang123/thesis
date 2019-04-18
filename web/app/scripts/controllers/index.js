'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('IndexCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.hideInformation = function () {
            $rootScope.sliderAndContent = false;
        };
    }]);
