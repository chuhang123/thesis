'use strict';

/**
 * @ngdoc service
 * @name webappApp.RoleService
 * @description
 * # RoleService
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('BookService', function ($http, CommonService) {
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

        return {
            findTop4ByOrderByCreateTimeDesc: self.findTop4ByOrderByCreateTimeDesc,
            findTop4ByOrderByClicks: self.findTop4ByOrderByClicks,
            getCategorys: self.getCategorys
        };
    });
