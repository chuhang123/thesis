'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:StandardDevicesetEditCtrl
 * @description
 * # StandardDevicesetEditCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('BookAddCtrl', function ($scope, $state, $stateParams, BookService, CommonService) {
        var self = this;
        $scope.data = {
            name: '', // 名称
            price: '', // 价格
            author: '', // 作者
            briefIntroduction: '', // 简介
            attachment: '', // 封面
            clicks: '', // 点击量
            sales: '', // 销量
            inventory: '', // 库存
            category: '', // 类别
            press: '' // 出版社
        };

        self.saveAndClose = function () {
            BookService.save($scope.data, function () {
                CommonService.success(undefined, undefined, function () {
                    $state.go('system.Book');
                });
            });
        };

        // 统一暴露
        $scope.saveAndClose = self.saveAndClose;
    });
