'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('BookCtrl', ['$scope', '$rootScope', 'BookService', '$stateParams', function ($scope, $rootScope, BookService, $stateParams) {
        $rootScope.sliderAndContent = true;
        var self = this;
        self.getBySpecification = function() {
            var params = {name: $stateParams.name};
            BookService.getBySpecification(params, function (data) {
                $scope.books = data.content;
            });
        };

        self.getCategorys = function() {
            BookService.getCategorys(function (data) {
                $scope.categorys = data;
            });
        };

        self.getAllBooks = function() {
            BookService.getAll(function (data) {
                $scope.books = data;
            });
        };

        self.findBooksByCategoryId = function() {
            BookService.findBooksByCategoryId($stateParams.categoryId, function (data) {
              $scope.books = data;
            });
        };

        self.addToCart = function(id) {
            var postData = {book: [id], quantity:[1]};
            BookService.addToCart(postData);
        };

        if ($stateParams.categoryId !== '') {
            self.findBooksByCategoryId();
        } else if ($stateParams.name) {
            self.getBySpecification();
        } else {
            self.getAllBooks();
        }

        self.getCategorys();
        $scope.findBooksByCategoryId = self.findBooksByCategoryId;
        $scope.addToCart = self.addToCart;
    }]);

