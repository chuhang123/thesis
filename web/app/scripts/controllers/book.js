'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('BookCtrl', ['$scope', '$rootScope', 'BookService', function ($scope, $rootScope, BookService) {
        $rootScope.sliderAndContent = true;
        var self = this;

        self.getCategorys = function() {
            BookService.getCategorys(function (data) {
                $scope.categorys = data;
                console.log(data);
            });
        };

        self.getCategorys();

    }]);

