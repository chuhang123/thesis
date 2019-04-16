'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:StandardDevicesetAddCtrl
 * @description
 * # StandardDevicesetAddCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('StandardDeviceSetAddCtrl', function ($scope, $state, DeviceSetService, CommonService) {
        var self    = this;
        $scope.data = {
            code: '', // 代码
            name: '', // 计量标准装置名称
            certificateNum: '', // 考核证表编号
            checkDate: '', // 考核日期
            issueDate: '', // 颁发日期
            validityDate: '', // 有效期至
            alertDate: '' // 报警日期
        };

        self.saveAndClose = function () {
            DeviceSetService.save($scope.data, function () {
                CommonService.success(undefined, undefined, function () {
                    $state.go('standard.deviceSet');
                });
            });
        };

        // 统一暴露
        $scope.saveAndClose = self.saveAndClose;
    });
