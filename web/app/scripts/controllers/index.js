'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('IndexCtrl', ['$scope', '$rootScope', '$http', 'BookService', function ($scope, $rootScope, $http, BookService) {
        var self = this;
        $scope.hideInformation = function () {
            $rootScope.sliderAndContent = false;
        };

        self.findTop4ByOrderByCreateTimeDesc = function() {
            BookService.findTop4ByOrderByCreateTimeDesc(function (data) {
                $scope.latest = data;
            });
        };

        self.findTop4ByOrderByClicks = function() {
            BookService.findTop4ByOrderByClicks(function (data) {
                $scope.clicksMax = data;
            });
        };

        self.findTop4ByOrderByClicks();
        self.findTop4ByOrderByCreateTimeDesc();
    }]);
