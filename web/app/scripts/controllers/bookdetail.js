'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('BookDetailCtrl', ['$scope', '$rootScope', 'BookService', '$stateParams', function ($scope, $rootScope, BookService, $stateParams) {
        $rootScope.sliderAndContent = true;
        var self = this;

        self.get = function() {
            BookService.get($stateParams.id, function (data) {
                $scope.data = data;
            });
        };

        self.findTop4ByOrderByClicks = function() {
            BookService.findTop4ByOrderByClicks(function (data) {
                $scope.relateBooks = data;
                console.log(data);
            });
        };

        self.addToCart = function(id) {
            var postData = {book: [id], quantity:[$scope.quantity]};
            BookService.addToCart(postData);
        };

        self.get();
        self.findTop4ByOrderByClicks();
        $scope.addToCart = self.addToCart;
        $scope.quantity = 1;

    }]);

