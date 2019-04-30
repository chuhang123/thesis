'use strict';

/**
 * @ngdoc service
 * @name webappApp.RoleService
 * @description
 * # RoleService
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('BookService', function ($http, CommonService, UserService, $state) {
        var self = this;

        self.findTop4ByOrderByCreateTimeDesc = function (callback) {
            // 调用$http获取模拟数据
            $http.get('/Book/findTop4ByOrderByCreateTimeDesc').then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        self.findTop4ByOrderByClicks = function (callback) {
            // 调用$http获取模拟数据
            $http.get('/Book/findTop4ByOrderByClicks').then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };
        
        self.getCategorys = function (callback) {
            $http.get('/Category/getAll').then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        self.findBooksByCategoryId = function (categoryId, callback) {
            // 调用$http获取模拟数据
            $http.get('/Book/findBooksByCategoryId/' + categoryId).then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        self.getAll = function (callback) {
            $http.get('/Book/getAll').then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        self.get = function (id, callback) {
            // 调用$http获取模拟数据
            $http.get('/Book/' + id).then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        self.getShoppingCart = function (callback) {
            // 调用$http获取模拟数据
            $http.get('/ShoppingCart/').then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        self.addToCart = function(postData) {
            UserService.checkUserIsLogin(function (data) {
                if (data === false) {
                    $state.go('login');
                } else {
                    $http.post('/ShoppingCart/', postData)
                        .then(function success(response){
                            console.log(response);
                        }, function error(response){
                            console.log(response);
                        });
                }
            });
        };

        self.generateIndent = function (data, callback) {
            var url = '/Indent/';
            $http.post(url, data)
                .then(function success(response){
                    if (callback) {callback(response.data);}
                }, function error(response){
                    CommonService.httpError(response);
                });
        };

        self.getBySpecification = function (params, callback) {
            $http.get('/Book/getBySpecification', {params: params}).then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        return {
            findTop4ByOrderByCreateTimeDesc: self.findTop4ByOrderByCreateTimeDesc,
            findTop4ByOrderByClicks: self.findTop4ByOrderByClicks,
            getCategorys: self.getCategorys,
            findBooksByCategoryId: self.findBooksByCategoryId,
            getAll: self.getAll,
            get: self.get,
            getShoppingCart: self.getShoppingCart,
            addToCart: self.addToCart,
            generateIndent: self.generateIndent,
            getBySpecification: self.getBySpecification
        };
    });
