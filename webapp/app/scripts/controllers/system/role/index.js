'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:SystemRoleIndexCtrl
 * @description
 * # SystemRoleIndexCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('SystemRoleIndexCtrl', function ($scope, RoleService) {
        var self = this;

        // 定义获取数据方法
        self.init = function () {
            // 获取后台数据
            RoleService.getAll(function (data) {
                $scope.datas = data;
            });
        };

        self.init();
    });
