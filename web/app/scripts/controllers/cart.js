'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('CartCtrl', ['$scope', '$rootScope', 'BookService', '$state', function ($scope, $rootScope, BookService, $state) {
        $rootScope.sliderAndContent = true;
        var self = this;

        self.getShoppingCart = function() {
            BookService.getShoppingCart(function (data) {
                $scope.books = data.arrayList;
                $scope.treeMap = data.treeMap;
            });
        };
        self.getShoppingCart();

        self.delete = function(data) {
            data.hide = true;
            $scope.treeMap[data.id] = 0;
        };

        self.updateShoppingCart = function() {
            var book = [];
            var quantity = [];
            $scope.books.forEach(function (value, i) {
                book[i] = value.id;
                quantity[i] = $scope.treeMap[value.id];
            });
            var postData = {book: book, quantity:quantity};
            BookService.addToCart(postData);
        };

        self.checkout = function() {
            self.updateShoppingCart();
            $state.go('checkout');
        };

        self.getTotalPrice = function() {
            $scope.totalPrice = 0;
            angular.forEach($scope.books, function (value) {
                $scope.totalPrice += value.price * $scope.treeMap[value.id];
            });
        };

        $scope.delete = self.delete;
        $scope.updateShoppingCart = self.updateShoppingCart;
        $scope.checkout = self.checkout;
        $scope.$watch('books',function(){
            self.getTotalPrice();
        });

        $scope.$watch('treeMap',function(){
            self.getTotalPrice();
        },true);
    }]);

