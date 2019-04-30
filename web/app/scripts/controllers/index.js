'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('IndexCtrl', ['$scope', '$rootScope', '$http', 'BookService', 'UserService', '$state', '$window', function ($scope, $rootScope, $http, BookService, UserService, $state, $window) {
        var self = this;
        $scope.books = [];

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

        self.getCategorys = function() {
            BookService.getCategorys(function (data) {
                $scope.categorys = data;
            });
        };

        self.addToCart = function(id) {
            var postData = {book: [id], quantity:[1]};
            BookService.addToCart(postData);
        };

        self.getShoppingCart = function() {
            BookService.getShoppingCart(function (data) {
                $scope.books = data.arrayList;
                $scope.treeMap = data.treeMap;
            });
        };

        self.getTotalPrice = function() {
            $scope.totalPrice = 0;
            angular.forEach($scope.books, function (value) {
                $scope.totalPrice += value.price * $scope.treeMap[value.id];
            });
        };

        self.checkUserIsLogin = function() {
            UserService.checkUserIsLogin(function (data) {
                $scope.isLogin = data;
            });
        };

        self.logout = function() {
            UserService.logout(function () {
                $window.location.reload();
            });
        };

        // 跳转到图书菜单，并且携带name参数
        self.goBookAndSpecification = function (data) {
            var params = {name: data};
            $state.go('book', params);
        };

        self.getShoppingCart();
        self.findTop4ByOrderByClicks();
        self.findTop4ByOrderByCreateTimeDesc();
        self.getCategorys();
        self.getShoppingCart();
        self.checkUserIsLogin();
        $scope.$watch('books',function(){
            self.getTotalPrice();
        });
        $scope.logout = self.logout;
        $scope.goBookAndSpecification = self.goBookAndSpecification;
        $scope.addToCart = self.addToCart;
    }]);
