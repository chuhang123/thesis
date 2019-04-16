'use strict';

/**
 * @ngdoc service
 * @name webappApp.RoleService
 * @description
 * # RoleService
 * Service in the webappApp.
 */
angular.module('webappApp')
    .service('RoleService', function ($http, CommonService) {
        var self = this;

        self.getAll = function (callback) {
            // 调用$http获取模拟数据
            $http.get('/Role/getAll').then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                CommonService.httpError(response);
            });
        };

        //定义save方法
        self.save = function ($scope, callback) {
            // 便历被点击的菜单，添加到menus中
            $scope.data.webAppMenus = [];
            self.getCheckedMenus($scope.datas, $scope.data.webAppMenus);
            // 调用$http进行数据传输
            $http.put('/Role/' + $scope.data.id, $scope.data).then(function successCallback(response) {
                if (callback) {
                    callback(response);
                }
            }, function errorCallback() {
                console.log('error');
            });
        };

        /**
         * 父菜单被点击时被触发
         * @param 被点击的父菜单
         * 将其子菜单的点击状态重置为与本身的状态相同
         * @author panjie
         */
        self.parentMenuClick = function (menu) {
            angular.forEach(menu._children, function (value, key) {
                menu._children[key].checked = menu.checked;
            });
        };

        /**
         * 添加是否默认选中的信息
         * @param menuTree 菜单树 以_children为子集关键字
         * @param menuAccessLists 需要选中的菜单集
         * @author panjie
         */
        self.addCheckedInfo = function (menuTree, menuAccessLists) {
            // 为菜单添加checked信息
            angular.forEach(menuTree, function (menu) {
                var keepGoing = true;
                angular.forEach(menuAccessLists, function (menuAccessList) {
                    if (keepGoing && menuAccessList.id === menu.id) {
                        menu.checked = true;
                        keepGoing    = false;
                    }
                });
                if (true === keepGoing) {
                    menu.checked = false;
                }
                if (!CommonService.isValid(menu._children)) {
                    self.addCheckedInfo(menu._children, menuAccessLists);
                }
            });
        };

        /**
         * 获取被选中的菜单
         * @param treeMenus 点选的树状菜单
         * @param result list结果集
         * @author panjie
         */
        self.getCheckedMenus = function (treeMenus, result) {
            angular.forEach(treeMenus, function (value) {
                if (value.checked) {
                    result.push({'id': value.id});
                }
                self.getCheckedMenus(value._children, result);
            });
        };

        return {
            getAll: self.getAll,
            parentMenuClick: self.parentMenuClick,
            save: self.save,
            addCheckedInfo: self.addCheckedInfo,
            getCheckedMenus: self.getCheckedMenus
        };
    });
