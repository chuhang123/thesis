'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:SystemRoleEditCtrl
 * @description
 * # SystemRoleEditCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('SystemRoleEditCtrl', function ($scope, $stateParams, $location, CommonService, WebAppMenuService, RoleService) {
        var self  = this;
        $scope.id = CommonService.getUniqueId();

        // 初始化信息
        self.init = function () {
            $scope.edit = true;
            $scope.data = $stateParams.data;
            WebAppMenuService.getMenuTree(function (datas) {
                // 对前台菜单添加权限
                RoleService.addCheckedInfo(datas, $scope.data.webAppMenus);
                $scope.datas = datas;
            });
        };

        self.init();

        /**
         * 提交数据
         * @author panjie
         */
        self.saveAndClose = function () {
            RoleService.save($scope, function () {
                $location.path('/system/role');
            });
        };

        // 统一暴露
        $scope.saveAndClose    = self.saveAndClose;
        $scope.parentMenuClick = RoleService.parentMenuClick;
    });
